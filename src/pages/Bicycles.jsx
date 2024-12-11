import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 75vh;
  flex-wrap: wrap;
`;

const Sidebar = styled.div`
  width: 23%;
  border-right: 1px solid #ddd;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 75vh;
  scrollbar-width: thin;
  scrollbar-color: #888 #f0f0f0;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem;
  height: 100%;  /* Set height to 100% of the container */
  max-height: 80vh;  /* Limit the height to 80vh */
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  overflow-y: auto;  /* Allow vertical scrolling if content overflows */
`;


const FilterCategory = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h4`
  cursor: pointer;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const FilterOptions = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: black;
  padding: 2px 4px;
  font-size: 0.8rem;
  margin: 1px;
  cursor: pointer;
  width: fit-content;
  border: none;

  .checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.9rem;
    background-color: ${(props) => (props.selected ? "#4CAF50" : "white")};
  }

  .checkbox-icon {
    display: ${(props) => (props.selected ? "block" : "none")};
    color: white;
    font-size: 0.6rem;
    font-weight: bold;
  }
`;

const BicycleBox = styled.div`
  width: 290px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.8rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 290px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const BicycleBrand = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 0;
`;

const BicycleTable = styled.table`
  width: 100%;
  margin-top: 0.4rem;
  border-collapse: collapse;
`;

const BicycleTableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const BicycleTableData = styled.td`
  font-size: 0.70rem;
  color: #555;
  padding: 0.2rem;
  text-align: left;
`;

const BicycleBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BicycleBoxButton = styled.button`
  margin-top: 1rem;
  padding: 0.3rem 0.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
  }
`;

const Bicycles = () => {
  const [filters, setFilters] = useState({
    frame: [],
    gear: [],
    wheel: [],
    saddle: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    frame: 0,
    gear: 0,
    wheel: 0,
    saddle: 0,
  });
  const [bicycles, setBicycles] = useState([]);
  const [openCategories, setOpenCategories] = useState({
    frame: false,
    gear: false,
    wheel: false,
    saddle: false,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [framesRes, gearsRes, wheelsRes, saddlesRes] = await Promise.all([
          fetch("https://bicycle.thegreenway.dk/api/frames").then((res) => res.json()),
          fetch("https://bicycle.thegreenway.dk/api/gears").then((res) => res.json()),
          fetch("https://bicycle.thegreenway.dk/api/wheels").then((res) => res.json()),
          fetch("https://bicycle.thegreenway.dk/api/saddles").then((res) => res.json()),
        ]);
        setFilters({
          frame: framesRes,
          gear: gearsRes,
          wheel: wheelsRes,
          saddle: saddlesRes,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const fetchBicycles = async (filters) => {
    try {
      const query = new URLSearchParams({
        frameId: filters.frame,
        gearId: filters.gear,
        wheelId: filters.wheel,
        saddleId: filters.saddle,
      }).toString();
  
      const response = await fetch(
        `https://bicycle.thegreenway.dk/api/bicycles/filter?${query}`
      );
      const data = await response.json();
      setBicycles(data); 
    } catch (error) {
      console.error("Error fetching bicycles:", error);
    }
  };

  const handleFilterChange = (category, id) => {
    const newId = selectedFilters[category] === id ? 0 : id;
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: newId,
    }));
  };

  useEffect(() => {
    fetchBicycles(selectedFilters);
  }, [selectedFilters]);

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <Container>
      <Sidebar>
        {Object.keys(filters).map((category) => (
          <FilterCategory key={category}>
            <FilterTitle onClick={() => toggleCategory(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterTitle>
            <FilterOptions isOpen={openCategories[category]}>
              {filters[category].map((item) => (
                <FilterButton
                  key={item.id}
                  selected={selectedFilters[category] === item.id}
                  onClick={() => handleFilterChange(category, item.id)}
                >
                  <div className="checkbox">
                    <span className="checkbox-icon">✔</span>
                  </div>
                  {item.model || item.name || item.brand}
                </FilterButton>
              ))}
            </FilterOptions>
          </FilterCategory>
        ))}
      </Sidebar>
      <Content>
        {bicycles.length === 0 ? (
          <p>No bicycles found. Please adjust your filters.</p>
        ) : (
          bicycles.map((bicycle) => (
            <BicycleBox key={bicycle.id}>
              <BicycleBoxContent>
                <BicycleBrand>{bicycle.brand}</BicycleBrand>
                <BicycleTable>
                  <tbody>
                    <BicycleTableRow>
                      <BicycleTableData>Model:</BicycleTableData>
                      <BicycleTableData>{bicycle.model}</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Price:</BicycleTableData>
                      <BicycleTableData>{bicycle.price} €</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Weight:</BicycleTableData>
                      <BicycleTableData>{bicycle.weight} kg</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Frame:</BicycleTableData>
                      <BicycleTableData>{bicycle.frame?.model}</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Gear:</BicycleTableData>
                      <BicycleTableData>{bicycle.gear?.model}</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Wheel:</BicycleTableData>
                      <BicycleTableData>{bicycle.wheel?.model}</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Saddle:</BicycleTableData>
                      <BicycleTableData>{bicycle.saddle?.model}</BicycleTableData>
                    </BicycleTableRow>
                    <BicycleTableRow>
                      <BicycleTableData>Description:</BicycleTableData>
                      <BicycleTableData>{bicycle.description}</BicycleTableData>
                    </BicycleTableRow>
                  </tbody>
                </BicycleTable>
              </BicycleBoxContent>
              <BicycleBoxButton>Details</BicycleBoxButton>
            </BicycleBox>
          ))
        )}
      </Content>
    </Container>
  );
};

export default Bicycles;
