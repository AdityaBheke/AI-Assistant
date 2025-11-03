import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function AiAssistant({isHidden}) {
      const [isListening, setIsListening] = useState(true);
  const [conversation, setConversation] = useState([{ role: "bot", content: "Hi I am your assistant by **Modelcam technologies!**" }]);
  const [loading, setLoading] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(true);
  const utteranceRef = useRef(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [leadEmail, setLeadEmail] = useState('');
  const leadIdRef = useRef(null);
  const [leadId, setLeadId] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
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
    // console.log("Recognition object",recognition)
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if(isHidden){
      stopConversation();
      return
    }
    setConversation([{ role: "bot", content: "Hi I am your assistant by **Modelcam technologies!**" }])
    utteranceRef.current = new SpeechSynthesisUtterance("Hi I am your assistant by Modelcam technologies");
    utteranceRef.current.onend = () => {
      startConversation()
    };
    window.speechSynthesis.speak(utteranceRef.current);
  }, [isHidden])
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
      if (isListeningRef.current) {
        speechDetected = true;
      setUserSpeaking(false);
      await handleSendMessage(userText);
      }
      
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

  // 🔹 Add user's message to conversation
  setConversation((prev) => [...prev, { role: "user", content: text }]);

  try {
    setUserSpeaking(false);
    setLoading(true);

    // Prepare messages array with correct roles
    const formattedMessages = [
      ...conversation.map((msg) => ({
        role: msg.role === "bot" ? "ai" : msg.role, // 🔹 convert 'bot' → 'ai'
        content: msg.content,
      })),
      { role: "user", content: text }, // include the latest message too
    ];

    // Call backend API
    const { data } = await axios.post(`${backendURL}/api/agent/chat`, {
      messages: formattedMessages,
      leadId: leadIdRef.current
    });

    console.log("Backend response:", data); // helpful for debugging

    // match backend response format
    const botReply = data.success
      ? data.data // <-- your backend returns 'data'
      : "Sorry, I couldn't get a response.";

    // Speak and display response
    if (isListeningRef.current) {
      setConversation((prev) => [...prev, { role: "bot", content: botReply }]);
      utteranceRef.current = new SpeechSynthesisUtterance(botReply);
      utteranceRef.current.onend = () => {
        if (isListeningRef.current) handleListening();
      };
      window.speechSynthesis.speak(utteranceRef.current);
    }
  } catch (error) {
    console.error("Backend error:", error);

    setConversation((prev) => [
      ...prev,
      { role: "bot", content: "Error connecting to the backend API." },
    ]);
  } finally {
    setLoading(false);
  }
};

const submitEmail = async (e) => {
  e.preventDefault();

  try {
    setLeadSubmitting(true); // start loading

    const response = await axios.post(`${backendURL}/api/agent/lead`, {
      email: leadEmail,
    });

    const leadIdReceived = response.data?.leadId;
    console.log("Lead Id received:", leadIdReceived);

    leadIdRef.current = leadIdReceived;
    setLeadId(leadIdReceived);

    setLeadEmail('');
  } catch (error) {
    console.error("Error submitting lead email:", error);
  } finally {
    // ✅ Stop loading in all cases
    setLeadSubmitting(false);
  }
};
  const speakResponse = (utterance)=>{
    window.speechSynthesis.speak(utterance)
  }
    return ( <div className={`assistant ${isHidden?'hide':''}`}>
          <h3 className="page-head">How can I help you?</h3>
    
          <div className="chat-box" ref={chatBoxRef}>
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-item ${msg.role === "user" ? "user" : "bot"}`}
              >
                <div className="sender">{msg.role === "user" ? <i className="fi fi-sr-user"></i> : <i className="fi fi-sr-user-robot"></i>}</div>
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
            {!leadId && <div className="lead-form">
              <form onSubmit={submitEmail} >
                <input type="email" required disabled={leadSubmitting} placeholder='Enter your email' value={leadEmail} onChange={(e)=>{setLeadEmail(e.target.value)}} />
                <button type="submit" disabled={leadSubmitting}>{leadSubmitting?"Submitting":"Submit"}</button>
              </form>
            </div>}
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