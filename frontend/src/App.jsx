
import { useState } from 'react';
import './App.css';
import AiAssistant from './pages/AiAssistantHandsFree';

function App() {
  const [isHidden, setIsHidden] = useState(true);
 
  const handleToggle = ()=>{
    setIsHidden((prev)=>!prev)
  }
  return (<div className='main'>
    <h1 className='page-head'>Modelcam Technologies</h1>


    <div className="floating-container">
      <AiAssistant isHidden={isHidden}/>
      <button className='toggle-button' onClick={handleToggle}>{isHidden?<i className="fi fi-rr-chatbot-speech-bubble"></i>:<i className="fi fi-sr-cross-small"></i>}</button>
    </div>
  </div>
  );
}

export default App;
