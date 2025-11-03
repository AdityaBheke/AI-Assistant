import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function AiAssistant({isHidden}) {
      const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const utteranceRef = useRef(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(()=>{
    if (chatBoxRef.current) {
      console.log("Scrolled")
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  },[userSpeaking])

  // Initialize speech recognition once
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    console.log("Recognition object",recognition)
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
  }, []);

  // Start conversation
  const startConversation = () => {
    if (!recognitionRef.current) return;
    console.log("Conversation started");
    setIsListening(true);
    isListeningRef.current = true;
    handleListening();
  };

  // Stop conversation
  const stopConversation = () => {
    console.log("Conversation ended");
    setIsListening(false);
    setUserSpeaking(false);
    setLoading(false);
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    if (utteranceRef.current) {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
  }
  };

  // Main listen–reply loop
  const handleListening = () => {
    if(!isListeningRef.current)return;
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.start();
    setUserSpeaking(true);
    console.log("Listening...");

    let speechDetected = false;

    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript.trim();
      console.log("Heard:", userText);
      speechDetected = true
      setUserSpeaking(false);
      await handleSendMessage(userText);
    };

    recognition.onend = () => {
      if (!isListeningRef.current) {
        console.log("Listening stopped by user");
      return;
      }
      if (speechDetected) {
          console.log("Speeach detected waiting for bot's reply...")
        } else {
          console.log("no speech detected restarting in 500ms")
          setTimeout(handleListening, 500)
        }
    };

    recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    if (event.error === "no-speech" && isListeningRef.current) {
      console.log("No speech detected, restarting recognition...");
      setTimeout(() => handleListening(), 500); // small delay to avoid overlapping
    }
  };
  };

  // Send message to backend and update chat
  const handleSendMessage = async (text) => {
    if (!text) return;

    setConversation((prev)=>([...prev, { sender: "user", content: text } ]));

    try {
      setUserSpeaking(false)
      setLoading(true);
      const { data } = await axios.post(`${backendURL}/api/transcribe`, {
        message: text,
      });

      const botReply = data.success
        ? data.reply
        : "Sorry, I couldn't get a response.";

        
        // Speak out bot's response
        if (isListeningRef.current) {
            setConversation((prev)=>[...prev, { sender: "bot", content: botReply }]);
            utteranceRef.current = new SpeechSynthesisUtterance(botReply);
            utteranceRef.current.onend = () => {
                if (isListeningRef.current) handleListening();
            };
            window.speechSynthesis.speak(utteranceRef.current);
        }
      
    } catch (error) {
      console.error("Backend error:", error);
      
      setConversation((prev)=>[...prev, { sender: "bot", content: "Error connecting to Gemini API." }]);
    } finally {
      setLoading(false);
    }
  };
    return ( <div className={`assistant ${isHidden?'hide':''}`}>
          <h3 className="page-head">How can I help you?</h3>
    
          <div className="chat-box" ref={chatBoxRef}>
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-item ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <div className="sender">{msg.sender === "user" ? <i className="fi fi-sr-user"></i> : <i className="fi fi-sr-user-robot"></i>}</div>
                <div className="content">
                  <ReactMarkdown> 
                  {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
    
            {loading && (
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
                {isListening ? <><i className="fi fi-bs-stop-circle"></i> End Conversation</> : <><i className="fi fi-ss-circle-microphone"></i> Start Conversation</>}
              </button>
            </div>
          </div>
        </div> );
}

export default AiAssistant;