import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.7); 
  background-image: url('/cyclist-2-ny.png'); 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
 
  // Tablet media query
  @media (max-width: 768px) {
    min-height: 40vh;
  }

  // Mobile media query
  @media (max-width: 510px) {
    min-height: 38vh;
  }
`;

const LinkList = styled.div`
  text-align: center;
`;

const StyledLink = styled.a`
  display: block;
  font-size: 1.4rem;
  color: black;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 20px;
  
  &:hover {
    text-decoration: underline;
    color: #005bb5;
  }

  // Tablet media query
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  // Mobile media query
  @media (max-width: 510px) {
    font-size: 1.1rem;
  }
`;

function Bicycles() {
  return (
    <Container>
      
    </Container>
  );
}

export default Bicycles;
