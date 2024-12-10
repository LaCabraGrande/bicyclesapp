import { useEffect, useState } from "react";
import styled from "styled-components";

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
  height: 80vh;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterCategory = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h4`
  cursor: pointer;
  margin: 0;
`;

const FilterOptions = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const BicycleBox = styled.div`
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Bicycles = () => {
  const [filters, setFilters] = useState({
    frames: [],
    gears: [],
    wheels: [],
    saddles: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    frame: 0,
    gear: 0,
    wheel: 0,
    saddle: 0,
  });
  const [bicycles, setBicycles] = useState([]);
  const [openCategories, setOpenCategories] = useState({
    frames: false,
    gears: false,
    wheels: false,
    saddles: false,
  });

  // Fetch filters for frames, gears, wheels, saddles
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
          frames: framesRes,
          gears: gearsRes,
          wheels: wheelsRes,
          saddles: saddlesRes,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch bicycles based on selected filters
  useEffect(() => {
    const fetchBicycles = async () => {
      try {
        const query = new URLSearchParams({
          frameId: selectedFilters.frame || 0,
          gearId: selectedFilters.gear || 0,
          wheelId: selectedFilters.wheel || 0,
          saddleId: selectedFilters.saddle || 0,
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

    fetchBicycles();
  }, [selectedFilters]); // Re-fetch bicycles when filters change

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? 0 : value, // Toggle between selected value and 0
    }));
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filterKeys = {
    frames: "brand",
    gears: "model",
    wheels: "model",
    saddles: "model",
  };

  return (
    <Container>
      <Sidebar>
        <h3>Filters</h3>
        {Object.keys(filters).map((category) => (
          <FilterCategory key={category}>
            <FilterTitle onClick={() => toggleCategory(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterTitle>
            <FilterOptions isOpen={openCategories[category]}>
              {filters[category].map((item) => (
                <li key={item[filterKeys[category]]}>
                  <label>
                    <input
                      type="radio"
                      name={category}
                      checked={selectedFilters[category] === item[filterKeys[category]]}
                      onChange={() =>
                        handleFilterChange(category, item[filterKeys[category]])
                      }
                    />
                    {item[filterKeys[category]]}
                  </label>
                </li>
              ))}
            </FilterOptions>
          </FilterCategory>
        ))}
      </Sidebar>
      <Content>
        <h3>Bicycles</h3>
        {bicycles.length === 0 ? (
          <p>No bicycles found. Please adjust your filters.</p>
        ) : (
          bicycles.map((bicycle) => (
            <BicycleBox key={bicycle.id}>
              <h4>{bicycle.name}</h4>
              <p>Price: {bicycle.price}</p>
              <p>Model: {bicycle.model}</p>
            </BicycleBox>
          ))
        )}
      </Content>
    </Container>
  );
};

export default Bicycles;
