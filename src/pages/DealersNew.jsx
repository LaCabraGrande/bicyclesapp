import { useState } from "react";
import styled from "styled-components";
import YourInfo from "./YourInfo";
import Options from "./Options3";

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-image: url('/cyclist-2-ny.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Sidebar = styled.div`
  width: 25%;
  border-right: 1px solid #ddd;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 100vh;
  align-items: center;

  @media (max-width: 1068px) {
    width: 30%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  height: 75vh;
  width: 75%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;

const Info = styled.h3`
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1.3rem;

  &:hover {
    color: #007acc;
  }
`;

const OptionsTitle = styled.h3`
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1.3rem;

  &:hover {
    color: #007acc;
  }
`;

const SelectedFormTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2rem;
  text-align: center;
  

  /* Ekstra stil for hover-effekt, hvis det ønskes */
  &:hover {
    color: #007acc;
  }
`;

const Dealers = () => {
  const [activeTab, setActiveTab] = useState("YourInfo");
  const [selectedForm, setSelectedForm] = useState("");
  const [showOptions, setShowOptions] = useState(false); // Control Options visibility

  const handleOptionsClick = () => {
    if (activeTab === "Options") {
      setShowOptions((prev) => !prev); // Toggle visibility of Options
    } else {
      setActiveTab("Options");
      setShowOptions(true); // Ensure Options is visible
    }
    setSelectedForm(""); // Reset form selection
  };

  return (
    <Container>
      <Sidebar>
        <Info
          onClick={() => {
            setActiveTab("YourInfo");
            setSelectedForm(""); // Reset form selection
            setShowOptions(false); // Hide Options if switching tabs
          }}
        >
          Edit Info
        </Info>
        <OptionsTitle onClick={handleOptionsClick}>Options</OptionsTitle>
        {showOptions && <Options onFormSelect={setSelectedForm} />}
      </Sidebar>
      <Content>
        {selectedForm ? (
          <div>
            <SelectedFormTitle>{selectedForm}</SelectedFormTitle>
            {/* Render only the form for the selected option */}
            <Options activeForm={selectedForm} />
          </div>
        ) : (
          <YourInfo />
        )}
      </Content>
    </Container>
  );
};

export default Dealers;
