import { useEffect, useState } from "react";
import styled from "styled-components";
import facade from "../util/apiFacade";

const Card = styled.div`
  background: linear-gradient(135deg, darkgreen, darkgreen);
  color: white;
  border-radius: 15px;
  padding: 2rem; /* Justeret padding for bedre responsivitet */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 90%; /* Gør bredden fleksibel */
  max-width: 400px; /* Maksimal bredde */
  height: auto; /* Lad højden tilpasse sig indholdet */
  font-family: Arial, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* Centrerer kortet horisontalt */
  box-sizing: border-box;
  min-height: 300px; /* Sæt en minimumshøjde for at sikre, at der er nok plads til indhold */

  /* Responsiv tilpasning */
  @media (max-width: 768px) {
    width: 95%; /* Justerer bredden på mindre skærme */
    padding: 1.5rem; /* Justerer padding */
  }

  @media (max-width: 480px) {
    width: 100%; /* Fuldbredde på mobil */
    padding: 1rem; /* Mindre padding på mobil */
  }
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
  color: darkgreen;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Name = styled.h2`
  font-size: 1.3rem;
  margin: 10px 0;

  /* Responsiv font-størrelse */
  @media (max-width: 768px) {
    font-size: 1.1rem; /* Gør fonten lidt mindre */
  }

  @media (max-width: 480px) {
    font-size: 1rem; /* Endnu mindre på mobil */
  }
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

  /* Responsiv font-størrelse */
  @media (max-width: 768px) {
    font-size: 1em; /* Mindre skrift på mindre skærme */
  }

  @media (max-width: 480px) {
    font-size: 0.9em; /* Endnu mindre på mobil */
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

  return (
    <Card>
      <Avatar>{username ? username[0].toUpperCase() : "?"}</Avatar>
      <Name>{username ? `Welcome, ${username}` : "Guest"}</Name>
      {username ? (
        <InfoList>
          {/* <InfoItem>Email: {`${username}@example.com`}</InfoItem> */}
          <InfoItem>Role: {roles.length > 0 ? roles.join(", ") : "No roles assigned"}</InfoItem>
        </InfoList>
      ) : (
        <InfoItem>Please log in to see your details.</InfoItem>
      )}
    </Card>
  );
};

export default YourInfo;
