import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 100vh;
  min-height: 74vh;
  margin: 0 auto;
  padding: 80px 80px;
  background-color: rgba(255, 255, 255, 0.7);
  background-image: url('/cyclist-2-ny.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; 
   
  @media (max-width: 768px) {
    padding: 55px 45px;
    min-height: 55vh;
  }

  @media (max-width: 510px) {
    padding: 25px 25px;
    min-height: 60vh;
  }

  @media (max-width: 460px) {
    min-height: 60vh;
  } 
`;

const Paragraph = styled.p`
  padding: 10vh;
  font-size: 1.2rem;
  line-height: 1.3;
  color: #555;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 0.8rem;    
  }

  @media (max-width: 460px) {
    font-size: 0.85rem;
    padding: 2.5vh 0.5vh 0.5vh 0.5vh;
  }
  @media (max-width: 400px) {
    font-size: 0.75rem;    
  }
`;

const fullText = 
  "Vi samarbejder med mere end 30 forhandlere over hele landet, " +
  "som løbende opdaterer vores database med de nyeste racercykler til salg.\n\n Indtil " +
  "videre har vi valgt ikke at inkludere gravel- og crosscykler men udelukkende at fokusere på racercykler til brug på landevejen." +
  "\n\n Vi håber, at vores hjemmeside kan hjælpe dig med at få " +
  "et bedre overblik og finde din næste racercykel!";


function Vision() {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    let currentText = "";
      
    const playSound = () => {
      const sound = new Audio("/sounds/typing-sound-1.mp3");
      sound.play().catch(() => {});
    };
  
    const typewriter = () => {
      if (index < fullText.length) {
        const currentChar = fullText.charAt(index);
  
        if (currentChar === "\n") {
          currentText += "<br />";
        } else {
          currentText += currentChar;
          playSound();
        }
  
        setDisplayText(currentText);
        index++;
  
        const randomDelay = Math.random() * 150 + 100;
        setTimeout(typewriter, randomDelay);
      }
    };
  
    typewriter();
  
    return () => {
      index = fullText.length;
    };
  }, []);
  

  return (
    <Container>
      <Paragraph dangerouslySetInnerHTML={{ __html: displayText }} />
    </Container>
  );
}

export default Vision;

