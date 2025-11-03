import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Avatar from "../components/Avatar";

function AiAssistant({ isHidden }) {
  const [isListening, setIsListening] = useState(true);
  const [conversation, setConversation] = useState([
    { sender: "bot", content: "नमस्कार! मी तुमचा सहाय्यक आहे — **Modelcam Technologies** कडून!" },
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

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const scrollToBottom = () => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  };

  useEffect(scrollToBottom, [conversation]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // 🔹 Set language to Marathi
    recognition.lang = "mr-IN";

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (isHidden) {
      stopConversation();
      return;
    }

    setConversation([{ sender: "bot", content: "नमस्कार! मी तुमचा सहाय्यक आहे — **Modelcam Technologies** कडून!" }]);

    // 🔹 Marathi TTS
    utteranceRef.current = new SpeechSynthesisUtterance(
      "नमस्कार! मी तुमचा सहाय्यक आहे — Modelcam Technologies कडून"
    );
    utteranceRef.current.lang = "mr-IN"; // Ensure TTS is in Marathi

    utteranceRef.current.onend = () => {
      setBotSpeaking(false);
      startConversation();
    };

    setBotSpeaking(true);
    window.speechSynthesis.speak(utteranceRef.current);
  }, [isHidden]);

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
            utteranceRef.current.lang = "mr-IN"; // 🔹 Marathi TTS
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
        setConversation((prev) => [...prev, { sender: "bot", content: "Stream उत्तर मिळण्यात त्रुटी." }]);
      };

      return updated;
    });
  };

  return (
    <div className={`assistant ${isHidden ? "hide" : ""}`}>
      <div className="avatar-container">
        <Avatar botSpeaking={botSpeaking}/>
      </div>
      <h3 className="page-head">कसे मदत करू शकतो?</h3>

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
            <div className="thinking">विचार करत आहे...</div>
          </div>
        )}

        {userSpeaking && (
          <div className="chat-item user">
            <div className="sender"><i className="fi fi-sr-user"></i></div>
            <div className="thinking">बोलत आहे...</div>
          </div>
        )}
      </div>

      <div className="input-box">
        <div className="button-container">
          <button onClick={isListening ? stopConversation : startConversation}>
            {isListening ? (
              <>
                <i className="fi fi-bs-stop-circle"></i> संभाषण समाप्त करा
              </>
            ) : (
              <>
                <i className="fi fi-ss-circle-microphone"></i> संभाषण सुरू करा
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiAssistant;
