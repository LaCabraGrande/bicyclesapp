import { useState } from "react";
import styled from "styled-components";
import YourInfo from "./YourInfo";
import Options from "./Options3";
// import Options from "./OldVersionsOptions/Options2"

const Container = styled.div`
  display: flex;
  height: 80vh;
`;

const Sidebar = styled.div`
  width: 20%;
  border-right: 1px solid #ddd;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem;
  height: 80vh;
  box-sizing: border-box;
  allign-items: center;
  border: 1px solid #ddd;
  justify-content: center;
`;

const Info = styled.h3`
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    color: #007acc;
  }
`;

const OptionsTitle = styled.h3`
  cursor: pointer;
  margin-bottom: 1rem;

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
            <h3>{selectedForm}</h3>
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
