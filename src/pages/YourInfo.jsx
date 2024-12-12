import { useEffect, useState } from "react";
import styled from "styled-components";
import facade from "../util/apiFacade";

const Card = styled.div`
  background: linear-gradient(135deg, #39b739, #39b739);
  color: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  margin: 30px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
`;

const Avatar = styled.div`
  background-color: white;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
  color: #39b739;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Name = styled.h2`
  font-size: 1.8em;
  margin: 10px 0;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const InfoItem = styled.li`
  margin: 10px 0;
  font-size: 1.1em;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 8px;
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #c0392b;
  }
`;

const YourInfo = () => {
  const [username, setUsername] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = facade.getToken();
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedClaims = JSON.parse(window.atob(payloadBase64));
        setUsername(decodedClaims.username);

        // Standardize roles to always be an array
        const rolesData = decodedClaims.roles;
        setRoles(Array.isArray(rolesData) ? rolesData : rolesData ? [rolesData] : []);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setRoles([]);
      }
    }
  }, []);

  const handleLogout = () => {
    facade.logout();
    setUsername(null);
    setRoles([]);
  };

  return (
    <Card>
      <Avatar>{username ? username[0].toUpperCase() : "?"}</Avatar>
      <Name>{username ? `Welcome, ${username}` : "Guest"}</Name>
      {username ? (
        <>
          <InfoList>
            <InfoItem>Email: {`${username}@example.com`}</InfoItem>
            <InfoItem>Role: {roles.length > 0 ? roles.join(", ") : "No roles assigned"}</InfoItem>
          </InfoList>
        </>
      ) : (
        <InfoItem>Please log in to see your details.</InfoItem>
      )}
    </Card>
  );
};

export default YourInfo;
