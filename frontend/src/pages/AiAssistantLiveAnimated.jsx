import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import TalkingAnimation from './../assets/animations/Talking Character.json';
import Lottie from 'lottie-react';
import Avatar from "../components/Avatar";

function AiAssistant({ isHidden }) {
  // ------------------ State & Refs ------------------
  const [isListening, setIsListening] = useState(true);
  const [conversation, setConversation] = useState([
    { sender: "bot", content: "Hi I am your assistant by **Modelcam technologies!**" },
  ]);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(true);
  const recognitionRunningRef = useRef(false);
  const utteranceRef = useRef(null);
  const eventSourceRef = useRef(null);
  const maleVoiceRef = useRef(null); // 🔹 Added: store selected male voice

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ------------------ Helpers ------------------
  const scrollToBottom = () => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  };

  // ------------------ Effects ------------------
  useEffect(scrollToBottom, [conversation, userSpeaking]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
  }, []);

  // 🔹 NEW EFFECT: Load and select male voice correctly
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      voices.map((voice)=>{
        console.log("Voice", voice.lang,"==", voice.name);
        
      })
      
      if (voices.length > 0) {
        maleVoiceRef.current = voices.find(
          (voice) =>
            voice.lang.includes("en") &&
            (voice.name.toLowerCase().includes("male") ||
              voice.name.toLowerCase().includes("david") ||
              voice.name.toLowerCase().includes("daniel") ||
              voice.name.toLowerCase().includes("alex") ||
              voice.name.toLowerCase().includes("google uk english male"))
        );
        console.log("✅ Male voice selected:", maleVoiceRef.current?.name);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Try immediately too
  }, []); // Runs once

  // ------------------ Greeting & Start ------------------
  useEffect(() => {
    if (isHidden) {
      stopConversation();
      return;
    }

    setConversation([{ sender: "bot", content: "Hi I am your assistant by **Modelcam technologies!**" }]);

    utteranceRef.current = new SpeechSynthesisUtterance(
      "Hi I am your assistant by Modelcam technologies"
    );

    // 🔹 UPDATED: Use preloaded male voice from ref
    if (maleVoiceRef.current) utteranceRef.current.voice = maleVoiceRef.current;

    utteranceRef.current.onend = () => {
      setBotSpeaking(false);
      startConversation();
    };

    setBotSpeaking(true);
    window.speechSynthesis.speak(utteranceRef.current);
  }, [isHidden]);

  // ------------------ Conversation Control ------------------
  const startConversation = () => {
    if (!recognitionRef.current) return;
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setIsListening(true);
    isListeningRef.current = true;
    handleListening();
    setBotSpeaking(false);
    scrollToBottom();
  };

  const stopConversation = () => {
    setIsListening(false);
    setUserSpeaking(false);
    setBotThinking(false);
    setBotSpeaking(false);
    isListeningRef.current = false;

    recognitionRef.current?.stop();
    recognitionRunningRef.current = false;

    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // ------------------ Speech Recognition ------------------
  const handleListening = () => {
    if (!isListeningRef.current || recognitionRunningRef.current) return;

    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognitionRunningRef.current = true;
    recognition.start();
    setUserSpeaking(true);

    let speechDetected = false;

    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript.trim();
      if (isListeningRef.current) {
        speechDetected = true;
        setUserSpeaking(false);
        await handleSendMessage(userText);
      }
    };

    recognition.onend = () => {
      recognitionRunningRef.current = false;
      if (!isListeningRef.current) return;
      if (!speechDetected) setTimeout(handleListening, 500);
    };

    recognition.onerror = (event) => {
      recognitionRunningRef.current = false;
      if (event.error === "no-speech" && isListeningRef.current) setTimeout(handleListening, 500);
    };
  };

  // ------------------ Send Message & Streaming ------------------
  const handleSendMessage = (text) => {
    if (!text) return;

    setConversation((prev) => [...prev, { sender: "user", content: text }]);

    setConversation((prev) => {
      const botIndex = prev.length;
      const updated = [...prev, { sender: "bot", content: "" }];
      setBotThinking(true);

      if (eventSourceRef.current) eventSourceRef.current.close();

      const eventSource = new EventSource(`${backendURL}/stream-response?prompt=${encodeURIComponent(text)}`);
      eventSourceRef.current = eventSource;
      let streamedText = "";

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          eventSourceRef.current = null;
          setBotThinking(false);

          if (isListeningRef.current && streamedText.trim()) {
            utteranceRef.current = new SpeechSynthesisUtterance(streamedText);
            // 🔹 Use preloaded male voice here too
            if (maleVoiceRef.current) utteranceRef.current.voice = maleVoiceRef.current;

            setBotSpeaking(true);
            utteranceRef.current.onend = () => {
              setBotSpeaking(false);
              if (isListeningRef.current) handleListening();
            };
            window.speechSynthesis.speak(utteranceRef.current);
          }
          return;
        }

        streamedText += event.data;
        setConversation((prev) => {
          const newConv = [...prev];
          newConv[botIndex].content = streamedText;
          return newConv;
        });

        scrollToBottom();
      };

      eventSource.onerror = (err) => {
        console.error("Stream error:", err);
        eventSource.close();
        eventSourceRef.current = null;
        setBotThinking(false);
        setConversation((prev) => [...prev, { sender: "bot", content: "Error receiving streamed response." }]);
      };

      return updated;
    });
  };

  // ------------------ JSX ------------------
  return (
    <div className={`assistant ${isHidden ? "hide" : ""}`}>
      <div className="avatar-container">
        <Avatar botSpeaking={botSpeaking} />
      </div>
      <h3 className="page-head">How can I help you?</h3>

      <div className="chat-box" ref={chatBoxRef}>
        {conversation.map((msg, idx) => (
          <div key={idx} className={`chat-item ${msg.sender === "user" ? "user" : "bot"}`}>
            <div className="sender">
              {msg.sender === "user" ? <i className="fi fi-sr-user"></i> : <i className="fi fi-sr-user-robot"></i>}
            </div>
            <div className="content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {botThinking && (
          <div className="chat-item bot">
            <div className="sender"><i className="fi fi-sr-user-robot"></i></div>
            <div className="thinking">Thinking...</div>
          </div>
        )}

        {userSpeaking && (
          <div className="chat-item user">
            <div className="sender"><i className="fi fi-sr-user"></i></div>
            <div className="thinking">Speaking...</div>
          </div>
        )}
      </div>

      <div className="input-box">
        <div className="button-container">
          <button onClick={isListening ? stopConversation : startConversation}>
            {isListening ? (
              <>
                <i className="fi fi-bs-stop-circle"></i> End Conversation
              </>
            ) : (
              <>
                <i className="fi fi-ss-circle-microphone"></i> Start Conversation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiAssistant;
