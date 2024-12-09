import { useState } from "react";
import { NavLink } from "react-router";
import styled from "styled-components";
import apiFacade from "../util/apiFacade";

// Styled Components
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #39b739;
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
  font-size: 1.6rem;
  padding: 5px 10px;
  position: relative;

  &:hover {
    color: white;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${(props) => (props.isHovered || props.isActive ? "100%" : "0")};
    height: 2px;
    background-color: white;
    transition: width 0.3s ease, left 0.3s ease;
    left: ${(props) => (props.isHovered || props.isActive ? "0" : "50%")};
  }

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Smaller font size on tablet */
  }

  @media (max-width: 480px) {
    font-size: 1rem; /* Even smaller font size on mobile */
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column; /* Stack elements vertically on smaller screens */
    gap: 0.5rem;
  }
`;

const LoginForm = styled.form`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoginInput = styled.input`
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.7rem;
  width: 10vh;

  @media (max-width: 768px) {
    font-size: 0.8rem; /* Slightly larger font size on tablets */
  }

  @media (max-width: 480px) {
    font-size: 0.7rem; /* Smaller font size on mobile */
    padding: 0.3rem;
  }
`;

const Button = styled.button`
  padding: 0.4rem 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 0.7rem;
  margin-left: 7px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem; /* Slightly larger button text on tablet */
    padding: 0.4rem 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem; /* Smaller button text on mobile */
    padding: 0.3rem 0.5rem;
  }
`;

const Header = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const login = (evt) => {
    evt.preventDefault();
    apiFacade
      .login(username, password)
      .then(() => setLoggedInUser(username))
      .catch(() => alert("Login failed"));
  };

  const logout = () => {
    apiFacade.logout();
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
  };

  // Link array updated to only include "Bicycles"
  const links = [{ to: "/Bicycles", label: "Bicycles" }];

  return (
    <HeaderWrapper>
      <Nav>
        {links.map((link) => (
          <StyledNavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
            isActive={hoveredLink === null && window.location.pathname === link.to}
            isHovered={hoveredLink === link.to}
            onMouseEnter={() => setHoveredLink(link.to)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {link.label}
          </StyledNavLink>
        ))}
      </Nav>
      <AuthSection>
        {loggedInUser ? (
          <div>
            {loggedInUser}
            <Button onClick={logout}>Logout</Button>
          </div>
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
