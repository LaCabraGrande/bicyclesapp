import { useState } from "react";
import styled from "styled-components";

const TableContainer = styled.div`
 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
 
  @media (max-width: 480px) {
    margin-top: 0;
    width: 100%;  
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

const Th = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #f1f1f1;
  border-bottom: 2px solid #ddd;
  border-right: 1px solid #ddd;
  width: ${(props) => props.width || "auto"};
  &:last-child {
    border-right: none;
  }

  @media (max-width: 905px) {
    padding: 5px; /* Mindre padding på mindre skærme */
    font-size: 0.8rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 845px) {
    font-size: 0.7rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 723px) {
      font-size: 0.6rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 675px) {
      font-size: 0.55rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 595px) {
      font-size: 0.5rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 550px) {
      font-size: 0.45rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 510px) {
      font-size: 0.4rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 460px) {
    padding: 5px;  
    font-size: 0.35rem; /* Reducer fontstørrelsen */
  }

`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 0.8rem;
  border-right: 1px solid #ddd;
  background-color: ${(props) => props.bgColor || "white"};
  color: ${(props) => props.textColor || "black"};
  width: ${(props) => props.width || "auto"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  &:last-child {
    border-right: none;
  }

  @media (max-width: 905px) {
    padding: 10px; /* Mindre padding */
    font-size: 0.8rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 853px) {
    font-size: 0.7rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 730px) {
      font-size: 0.65rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 685px) {
      font-size: 0.55rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 605px) {
      font-size: 0.5rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 560px) {
      font-size: 0.45rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 515px) {
      font-size: 0.4rem; /* Reducer fontstørrelsen */
  }
  @media (max-width: 460px) {
      padding: 5px;
      font-size: 0.31rem; /* Reducer fontstørrelsen */
  }
 

`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0px 10px 0px;
  gap: 25px;

  @media (max-width: 768px) {
    flex-wrap: wrap; 
    gap: 10px; 
  }
  @media (max-width: 480px) {
    gap: 5px;  
  }
`;

const Button = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => props.bgColor || "#007bff"};
  color: ${(props) => props.textColor || "white"};
  font-size: 16px;
  font-weight: ${(props) => props.fontWeight || "normal"};
  cursor: pointer;
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
  }

  &.active {
    background-color: ${(props) => props.activeColor || "#007bff"};
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 6px 14px; 
    font-size: 0.8rem; 
  }
  @media (max-width: 520px) {
    padding: 6px 12px;
    font-size: 0.55rem;
  }
  @media (max-width: 460px) {
    padding: 5px 10px;
    font-size: 0.50rem;
  }


`;

const Endpoints = () => {
  const [activeMethod, setActiveMethod] = useState("GET");

  const getCellStyles = (method) => {
    switch (method) {
      case "GET":
        return { bgColor: "#007bff", textColor: "white", fontWeight: "bold" }; // Blå
      case "POST":
        return { bgColor: "#28a745", textColor: "white", fontWeight: "bold" }; // Grøn
      case "PUT":
        return { bgColor: "#ffc107", textColor: "white", fontWeight: "bold" }; // Gul
      case "DELETE":
        return { bgColor: "#dc3545", textColor: "white", fontWeight: "bold" }; // Rød
      default:
        return {};
    }
  };
  
  const getButtonStyles = (method) => {
    switch (method) {
      case "GET":
        return { bgColor: "#007bff", textColor: "white", fontWeight: "bold", hoverColor: "#0056b3", activeColor: "#007bff"}; // Blå
      case "POST":
        return { bgColor: "#28a745", textColor: "white", fontWeight: "bold", hoverColor: "#218838", activeColor: "#28a745"}; // Grøn
      case "PUT":
        return { bgColor: "#ffc107", textColor: "white", fontWeight: "bold", hoverColor: "#e0a800", activeColor: "#ffc107"}; // Gul
      case "DELETE":
        return { bgColor: "#dc3545", textColor: "white", fontWeight: "bold", hoverColor: "#c82333", activeColor: "#dc3545"}; // Rød
      default:
        return {};
    }
  };

  const renderTable = () => {
    const renderRow = (method, url, requestBody, response, error) => {
      const { bgColor, textColor, fontWeight } = getCellStyles(method);
      return (
        <tr key={url}>
          <Td bgColor={bgColor} textColor={textColor} fontWeight={fontWeight} width="10%">{method}</Td>
          <Td width="31%">{url}</Td>
          <Td width="32%">{requestBody}</Td>
          <Td width="19%">{response}</Td>
          <Td width="8%">{error}</Td>
        </tr>
      );
    };

    const rows = {
      GET: [
        ["/bicycles/populate", "", "60 road bicycles", "(e)"],
        ["/bicycles/filter", "", "[bicycle, bicycle, …] (N)", "(e)"],
        ["/bicycles/", "", "[bicycle, bicycle, …] (N)", "(e)"],
        ["/bicycles/{id}", "", "bicycle(1)", "(e)"],
        ["/frames", "", "[frame, frame, …] (N)", "(e)"],
        ["/frames/{id}", "", "frame(1)", "(e)"],
        ["/gears", "", "[gear, gear, …] (N)", "(e)"],
        ["/gears/{id}", "", "gear(1)", "(e)"],
        ["/wheels", "", "[wheel, wheel, …] (N)", "(e)"],
        ["/wheels/{id}", "", "wheel(1)", "(e)"],
        ["/saddles", "", "[saddle, saddle, …] (N)", "(e)"],
        ["/saddles/{id}", "", "saddle(1)", "(e)"],
      ],
      POST: [
        ["/bicycles/", "bicycle (1) without id", "bicycle", "(e)"],
        ["/bicycles/{bicycleId}/frame/{frameId}", "bicycleId and frameId", "bicycle", "(e)"],
        ["/bicycles/{bicycleId}/gear/{gearId}", "bicycleId and gearId", "bicycle", "(e)"],
        ["/bicycles/{bicycleId}/wheel/{wheelId}", "bicycleId and wheelId", "bicycle", "(e)"],
        ["/bicycles/{bicycleId}/saddle/{saddleId}", "bicycleId and saddleId", "bicycle", "(e)"],
        ["/frames/", "frame (1) without id", "frame (1)", "(e)"],
        ["/gears/", "gear (1) without id", "gear (1)", "(e)"],
        ["/wheels/", "wheel (1) without id", "wheel (1)", "(e)"],
        ["/saddles/", "saddle (1) without id", "saddle (1)", "(e)"],
        ["/auth/login", "username and password", "token and username", "(e)"],
        ["/auth/register", "username and password", "token and username", "(e)"],
        ["/auth/user/addrole", "role", "message", "(e)"],
      ],
      PUT: [
        ["/bicycles/{id}", "", "bicycle (1)", "(e)"],
        ["/frames/{id}", "", "frame (1)", "(e)"],
        ["/gears/{id}", "", "gear (1)", "(e)"],
        ["/wheels/{id}", "", "wheel (1)", "(e)"],
        ["/saddles/{id}", "", "saddle(1)", "(e)"],
      ],
      DELETE: [
        ["/bicycles/{id}", "", "message and bicycle (1)", "(e)"],
        ["/frames/{id}", "", "message and frame (1)", "(e)"],
        ["/gears/{id}", "", "message and gear (1)", "(e)"],
        ["/wheels/{id}", "", "message and wheel (1)", "(e)"],
        ["/saddles/{id}", "", "message and saddle(1)", "(e)"],
      ],
    };

    return (
      <Table>
        <thead>
          <tr>
            <Th width="10%">Method</Th>
            <Th width="30%">URL</Th>
            <Th width="20%">Request Body (JSON)</Th>
            <Th width="30%">Response (JSON)</Th>
            <Th width="10%">Error (JSON)</Th>
          </tr>
        </thead>
        <tbody>
          {rows[activeMethod].map(([url, requestBody, response, error]) =>
            renderRow(activeMethod, url, requestBody, response, error)
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      <ButtonGroup>
        {["GET", "POST", "PUT", "DELETE"].map((method) => {
          const { bgColor, textColor, fontWeight, hoverColor, activeColor } = getButtonStyles(method);
          return (
            <Button
              key={method}
              className={method === activeMethod ? "active" : ""}
              onClick={() => setActiveMethod(method)}
              bgColor={bgColor}
              textColor={textColor}
              fontWeight={fontWeight}
              hoverColor={hoverColor}
              activeColor={activeColor}
            >
              {method}
            </Button>
          );
        })}
      </ButtonGroup>
      <TableContainer>{renderTable()}</TableContainer>
    </div>
  );
};

export default Endpoints;
