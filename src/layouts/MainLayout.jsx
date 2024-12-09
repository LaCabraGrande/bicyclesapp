import { Outlet } from "react-router";
import GlobalStyle from "../styles/GlobalStyle";
import styled from "styled-components";
import Header from "../components/Header";

// Styled container for the layout
const Container = styled.div`
  display: grid;
  place-items: center;
  max-width: var(--large-device);
  width: 90%;
  margin-top: 2rem;
  padding: 0;
  border: 1px solid silver;
  border-radius: 0px;
  background-color: #39b739;
  box-shadow: 0 0 55px rgba(0, 0, 0, 0.3), 0 0 55px rgba(0, 0, 0, 0.3);

  // Mobile media query
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

// Styled footer
const Footer = styled.footer`
  text-align: center;
  padding: 20px 20px 25px 20px;
  background-color: #39b739;
  color: white;

  p {
    font-size: 1rem;
    position: relative;
    display: inline-block;
    cursor: pointer;
    color: white; 
    transition: background-position 1s ease-in-out;
    padding: 0 5px; 
    background-clip: text;
    -webkit-background-clip: text;
  }

  p:hover {
    color: transparent; /* Makes the text color transparent for gradient effect */
    background-image: linear-gradient(90deg, #ffcc66, #ff4f00, #ffcc66); /* Lighter yellow and red-orange */
    background-size: 200% 100%;
    background-position: 0% 50%; /* Starts from left */
    animation: tennisBall 3s ease-in-out infinite; /* Slow down the animation */
  }

  // Animation to move the gradient left-right (like a tennis ball)
  @keyframes tennisBall {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%; /* Move to the right */
    }
    100% {
      background-position: 0% 50%; /* Move back to the left */
    }
  }

  
  /* Tablet media query */
  @media (max-width: 768px) {
    padding: 10px 10px 15px 10px;
    p {
      margin: 5px 0;
      font-size: 0.7rem; 
    }
  }

  /* Mobile media query */
  @media (max-width: 480px) {
    p {
      font-size: 0.6rem; 
    }
  }
`;

function MainLayout() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <header>
          <Header />
        </header>
        <main>
          <Outlet />
        </main>
        <Footer>
          <p>
            &copy; Pejtersen & Grønberg
          </p>
          <p>
            Bicycle API Documentation
          </p>
        </Footer>
      </Container>
    </>
  );
}

export default MainLayout;
