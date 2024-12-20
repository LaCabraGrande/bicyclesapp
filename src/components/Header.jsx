import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import styled from "styled-components";
import facade from "../util/apiFacade";

// Styled Components
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1rem;
  background-color: darkgreen;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 1rem;
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

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
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
  gap: 0rem;
  font-size: 0.8rem;  /* Ændret her for at styre brugernavnets størrelse */

  @media (max-width: 768px) {
    font-size: 0.8rem;  /* Størrelse for tablet */

  }

  @media (max-width: 480px) {
    font-size: 0.5rem; /* Størrelse for mobil */
  }
`;

const UserName = styled.div`
  font-size: 0.8rem;  /* Ændret her for at styre brugernavnets størrelse specifikt */
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const LoginForm = styled.form`
  display: flex;
  gap: 0.2rem;
    
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoginInput = styled.input`
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; /* Inputfelterne fylder 100% af containeren */
  max-width: 7rem; /* Maksimal bredde for inputfelterne */
  font-size: 0.7rem;

   /* Fjern fokusramme */
   &:focus {
    outline: none;
    background-color: #e6f7ff; /* Lys blå baggrundsfarve ved fokus */
    border: 1px solid #ccc; /* Optional, hvis du stadig ønsker en subtil grå kant ved fokus */
  }

  /* Juster størrelsen på inputfelterne på tablet (maks. bredde på 768px) */
  @media (max-width: 1068px) {
    width: 70%; /* Inputfelterne fylder 90% af containeren */
    max-width: 6rem; /* Maksimal bredde på tablet */
    font-size: 0.6rem;
  }

  /* Juster størrelsen på inputfelterne på mobil (maks. bredde på 480px) */
  @media (max-width: 480px) {
    width: 80%; /* Inputfelterne fylder 80% af containeren */
    max-width: 15rem; /* Maksimal bredde på mobil */
  }
`;


const Button = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 0.7rem;  /* Ændret her for at styre knapstørrelsen */
  margin-left: 7px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem; /* Lidt mindre på tablet */
    padding: 0.3rem 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem; /* Lidt mindre på mobil */
    padding: 0.3rem 0.5rem;
  }
`;

const Header = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check local storage for logged-in user
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const login = (evt) => {
    evt.preventDefault();
    facade
      .login(username, password)
      .then(() => {
        setLoggedInUser(username);
        localStorage.setItem("loggedInUser", username); // Save to local storage
        navigate("/Dealers"); // Navigate to the Dealers page on successful login
      })
      .catch(() => alert("Login failed"));
  };

  const logout = () => {
    facade.logout();
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    localStorage.removeItem("loggedInUser"); // Remove from local storage
    navigate("/"); // Navigate to the front page on logout
  };

  const links = [{ to: "/Bicycles", label: "Bicycles" },
  { to: "/", label: "Frontpage" },
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
          <LoginForm onSubmit={login}>
            <LoginInput
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <LoginInput
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
          </LoginForm>
        )}
      </AuthSection>
    </HeaderWrapper>
  );
};

export default Header;
