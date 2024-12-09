import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 100vh;
  min-height: 60vh;
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
    padding: 35px 25px;
    min-height: 50vh;
  }

  @media (max-width: 420px) {
    min-height: 50vh;
  }

  @media (max-width: 390px) {
    min-height: 60vh;
  }
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.3;
  color: #555;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
  @media (max-width: 380px) {
    font-size: 0.60rem;
  }

`;

const fullText = `Vi har samarbejde med over 250 forhandlere på landsplan, som løbende opdaterer vores database med de cykler, de aktuelt har til salg.\n
Hvis du ønsker at søge efter racercykler baseret på komponenter, kan du vælge linket "Bicycles". Er du derimod interesseret i at finde komponenter og få detaljer om de enkelte, kan du vælge linket "Components".\n
Vi håber, du får en god oplevelse!
`;

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
          //playSound(); lyden er ikke til at holde ud at høre på så den her jeg slået fra
        }

        setDisplayText(currentText);
        index++;

        const randomDelay = Math.random() * (30) + 20;
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

