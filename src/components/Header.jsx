import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import styled from "styled-components";
import facade from "../util/apiFacade";

// Styled Components
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1rem 1rem 1rem;
  background-color: darkgreen;
  border-bottom: 1px solid #ddd;
  
  @media (max-width: 850px) {
    padding: 1.0rem 0.3rem 1.0rem 0.3rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  padding: 5px 10px;
  position: relative;

  &:hover {
    color: white;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: ${({ $isHovered, $isActive }) =>
      $isHovered || $isActive ? "0" : "50%"};
    width: ${({ $isHovered, $isActive }) =>
      $isHovered || $isActive ? "100%" : "0"};
    height: 1px;
    background-color: white;
    transition: width 0.3s ease, left 0.3s ease;
  }

  @media (max-width: 860px) {
    font-size: 1.2rem;
  }

  @media (max-width: 505px) {
    font-size: 1.1rem;
    padding: 5px 0px;
  }

  @media (max-width: 435px) {
    padding: 0px 0px;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0rem;
  color: white;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
`;

const UserName = styled.div`
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

// Modal styling
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  max-height: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  transform: ${({ isVisible }) => (isVisible ? "scale(1)" : "scale(0.8)")};
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #e6f7ff;
`;

const ModalButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: darkgreen;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #006400;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const Button = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #0056b3;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.8s ease;

  &:hover {
    background-color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }


`;

const Header = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Her chekker vi om der i local storage er sat en logged-in user. I så fald sætter vi den i state.
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const login = (evt) => {
    evt.preventDefault(); // Her forhindrer vi at siden reloader hvilket ville medføre at vi mister state og dermed logged-in user
    facade
        .login(username, password)
        .then(() => {
            setLoggedInUser(username); // Opdaterer state med brugernavn
            navigate("/Dealers"); // Navigerer til Dealers-siden
            setIsModalOpen(false); // Lukker login-modalen
        })
        .catch((error) => {
          const errorMessage = error.fullError?.error || "Login failed"; // Brug serverens fulde fejlbesked eller Login failed som standard
          alert(errorMessage); // alert med fejlbesked
        })
  };


  const logout = () => {
    facade.logout();
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    navigate("/"); // Navigate to the front page on logout
  };

  const openLoginModal = () => setIsModalOpen(true);
  const closeLoginModal = () => setIsModalOpen(false);

  const links = [{ to: "/Vision", label: "Vision" },
  { to: "/", label: "Bicycles" },
  ...(loggedInUser
    ? [{ to: "/Dealers", label: "Dealers"}]
    : []),
];

  return (
    <HeaderWrapper>
      <Nav>
        {links.map((link) => (
          <StyledNavLink
            key={link.to}
            to={link.to}
            $isActive={hoveredLink === null && window.location.pathname === link.to}
            $isHovered={hoveredLink === link.to}
            onMouseEnter={() => setHoveredLink(link.to)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {link.label}
          </StyledNavLink>
        ))}
      </Nav>

      <AuthSection>
        {loggedInUser ? (
          <UserInfo>
            <UserName>{loggedInUser}</UserName>  
            <Button onClick={logout}>Logout</Button>
          </UserInfo>
        ) : (
          <Button onClick={openLoginModal}>Login</Button>
        )}
      </AuthSection>

      {/* Modal for login */}
      <ModalBackdrop isVisible={isModalOpen} onClick={closeLoginModal}>
        <ModalContainer isVisible={isModalOpen} onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeLoginModal}>&times;</CloseButton>
          <ModalForm onSubmit={login}>
            <ModalInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <ModalInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ModalButton type="submit">Login</ModalButton>
          </ModalForm>
        </ModalContainer>
      </ModalBackdrop>
    </HeaderWrapper>
  );
};

export default Header;
