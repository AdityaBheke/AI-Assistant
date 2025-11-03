import { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import TalkingAnimation from "../assets/animations/Talking Avatar Updated.json";

function Avatar({ botSpeaking }) {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current) {
      if (botSpeaking) {
        lottieRef.current.play();   // 👈 Start animation
      } else {
        lottieRef.current.stop();   // 👈 Stop animation
      }
    }
  }, [botSpeaking]);

  return (
      <Lottie
        lottieRef={lottieRef}
        animationData={TalkingAnimation}
        loop={true}
        autoPlay={false}
        // style={{ width: 200, height: 200 }}
        className="bot-avatar"
      />
  );
}

export default Avatar;
