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
  height: 100%;
  max-height: 80vh;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  overflow-y: auto;
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
    gear: {},
    saddle: {},
    wheel: {},
  });
  const [selectedFilters, setSelectedFilters] = useState({
    gear: [],
    saddle: [],
    wheel: [],
  });
  const [bicycles, setBicycles] = useState([]);
  const [openCategories, setOpenCategories] = useState({
    gear: false,
    saddle: false,
    wheel: false,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(
          "https://bicycle.thegreenway.dk/api/bicycles/filtercounts"
        );
        const data = await response.json();
        setFilters({
          gear: data.gearSeriesCount,
          saddle: data.saddleBrandCount,
          wheel: data.wheelBrandCount,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const fetchBicycles = async () => {
    try {
      const queryParams = new URLSearchParams();
  
      // Hvis gear er valgt, tilføj gearSeries korrekt
      if (selectedFilters.gear.length > 0) {
        selectedFilters.gear.forEach((gear) => {
          queryParams.append("gearSeries", gear);
        });
      }
  
      // Hvis wheel brand er valgt, tilføj wheelBrand korrekt
      if (selectedFilters.wheel.length > 0) {
        selectedFilters.wheel.forEach((wheel) => {
          queryParams.append("wheelBrand", wheel);
        });
      }
  
      // Hvis saddle brand er valgt, tilføj saddleBrand korrekt
      if (selectedFilters.saddle.length > 0) {
        selectedFilters.saddle.forEach((saddle) => {
          queryParams.append("saddleBrand", saddle);
        });
      }
  
      // Tilføj minPrice og maxPrice til slutningen af URL'en
      queryParams.append("minPrice", 0);
      queryParams.append("maxPrice", 18000);
  
      // Byg den korrekte URL til API-anmodningen
      const response = await fetch(
        `https://bicycle.thegreenway.dk/api/bicycles/filterbicycles?${queryParams.toString()}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP-fejl! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);  // Log responsen fra API'et
      setBicycles(data);
    } catch (error) {
      console.error("Error fetching bicycles:", error);
    }
  };
  
  
  
  

  const handleFilterChange = (category, brand) => {
    setSelectedFilters((prev) => {
      const newSelection = prev[category].includes(brand)
        ? prev[category].filter((item) => item !== brand)
        : [...prev[category], brand];

      console.log(newSelection); // Log udvalgte filtre
      return {
        ...prev,
        [category]: newSelection,
      };
    });
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  useEffect(() => {
    fetchBicycles();
  }, [selectedFilters]);

  return (
    <Container>
      <Sidebar>
        {Object.keys(filters).map((category) => (
          <FilterCategory key={category}>
            <FilterTitle onClick={() => toggleCategory(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterTitle>
            <FilterOptions isOpen={openCategories[category]}>
              {Object.entries(filters[category]).map(([brand, count]) => (
                <FilterButton
                  key={brand}
                  selected={selectedFilters[category].includes(brand)}
                  onClick={() => handleFilterChange(category, brand)}
                >
                  <div className="checkbox">
                    <span className="checkbox-icon">✔</span>
                  </div>
                  {brand} ({count})
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
                  </tbody>
                </BicycleTable>
                <BicycleBoxButton>Add to cart</BicycleBoxButton>
              </BicycleBoxContent>
            </BicycleBox>
          ))
        )}
      </Content>
    </Container>
  );
};

export default Bicycles;
