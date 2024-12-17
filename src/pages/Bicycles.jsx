import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 75vh;
  flex-wrap: wrap;
  background-image: url('/cyclist-2-ny.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Sidebar = styled.div`
  width: 20%;
  min-width: 270px;
  border-right: 1px solid #ddd;
  padding: 2rem 1.5rem 1.5rem 2rem;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 72vh;
  margin-right: 10px;
  margin-top: 5px;

  /* WebKit specific styling */
  &::-webkit-scrollbar {
    width: 6px; /* Scrollbar bredde */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #45a049; /* Thumb farve */
    border-radius: 2px; /* Runde hjørner */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #45a049; /* Hover effekt */
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* Track farve */
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 0fr));
  gap: 1rem; /* Mellemrum mellem boksene */
  padding-top: 0.5rem; /* Padding i containeren */
  height: 73vh; /* Højden af Content */
  max-height: 73vh; /* Maksimal højde på Content */
  margin-left: 10px; /* Mellemrum til kanten af containeren */
  width: 78%; /* Bredden af Content */
  overflow-y: auto; /* Scrollbar, hvis indholdet er for højt */
  grid-auto-rows: minmax(
    290px,
    290px
  ); /* Her styrer jeg rækkehøjden og kolonnebredden */

  /* WebKit specific styling */
  &::-webkit-scrollbar {
    width: 6px; /* Scrollbar bredde */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #45a049; /* Thumb farve */
    border-radius: 2px; /* Runde hjørner */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #45a049; /* Hover effekt */
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* Track farve */
  }
`;

const FilterCategory = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h4`
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: 2px;
  font-size: 1.1rem;
  font-weight: 400;
  color: darkgreen
`;

const FilterOptions = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent; /* Knappen selv har stadig en transparent baggrund */
  color: ${(props) => (props.disabled ? "#bbb" : "black")};
  padding: 2px 4px;
  font-size: 0.7rem;
  margin: 1px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
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

    background-color: ${(props) => {
      console.log("Count:", props.count); // Log værdien af count
      return props.disabled
        ? "#ddd" // Grå baggrund, når disabled
        : props.count === 0
        ? "#ddd" // Grå baggrund, når count er 0
        : props.selected
        ? "#4CAF50" // Grøn baggrund, når valgt
        : "white"; // Hvid baggrund ellers
    }};
  }

  .checkbox-icon {
    display: ${(props) =>
      props.selected && !props.disabled ? "block" : "none"};
    color: white;
    font-size: 0.6rem;
    font-weight: bold;
  }

  .count {
    margin-left: 10px;
    font-size: 0.9rem;
    color: ${(props) => (props.disabled ? "#bbb" : "#888")};
  }
`;

const BicycleBox = styled.div`
  min-height: 280px; /* Sikrer at hver boks har en minimumshøjde */
  width: 325px;
  height: 290px;
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  scrollbar-width: thin;
  padding-right: 5px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:hover .tooltip {
    visibility: visible; /* Gør tooltip synlig ved hover */
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 1rem; /* Positioner tooltip lidt nede fra toppen */
  right: 1.5rem; /* Placerer tooltip lidt væk fra højre kant */
  
  color: darkgreen;
  /*color: #4CAF50;*/
  text-align: center;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  transition: opacity 0.2s ease;
  pointer-events: none; /* Forhindrer interaktion med tooltip */
`;

const BicycleBoxContent = styled.div`
  width: 295px;
  height: 255px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-right: 10px;

  /* WebKit specific styling */
  &::-webkit-scrollbar {
    width: 5px; /* Scrollbar bredde */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #45a049; /* Thumb farve */
    border-radius: 2px; /* Runde hjørner */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #45a049; /* Hover effekt */
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* Track farve */
  }
`;

const BicycleBrand = styled.h4`
  font-size: 1.3rem;
  font-weight: 400;
  color: darkgreen;
  margin: 0;
  padding: 0;
`;

const BicycleTableContainer = styled.div`
  width: 100%;
  max-height: 230px; /* Fastsætter maksimalhøjden */
  height: 230px;
`;

const BicycleTable = styled.table`
  width: 280px;
  margin-top: 0.4rem;
  border-collapse: collapse;
`;

const BicycleTableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const BicycleTableData = styled.td`
  font-size: 0.7rem;
  color: #555;
  padding: 0.3rem;

  /* Definerer kolonnebredderne */
  &:first-child {
    width: 29%; /* Første kolonne får 30% af bredden */
    text-align: left;
    font-weight: bold;
  }

  &:nth-child(2) {
    width: 71%; /* Anden kolonne får 70% af bredden */
    text-align: left;
  }
`;

const StyledLink = styled.a`
  color: #45a049; /* Blå farve */
  text-decoration: none;
  font-weight: bold;
  font-size: 0.7rem;

  &:hover {
    text-decoration: none;
    color: #0056b3; /* Mørkere blå ved hover */
  }

  &:visited {
    color: #551a8b; /* Ændrer farven på besøgte links */
  }
`;

const Bicycles = () => {
  const [filters, setFilters] = useState({
    gearSeries: {},
    saddleBrand: {},
    wheelBrand: {},
    bicycleBrand: {},
    bicycleType: {},
    wheelType: {},
    priceInterval: {},
  });

  const [selectedFilters, setSelectedFilters] = useState({
    gearSeries: [],
    saddleBrand: [],
    wheelBrand: [],
    bicycleBrand: [],
    bicycleType: [],
    wheelType: [],
    priceInterval: [],
  });

  const [bicycles, setBicycles] = useState([]);
  const [openCategories, setOpenCategories] = useState({
    gearSeries: false,
    saddleBrand: false,
    wheelBrand: false,
    bicycleBrand: false,
    bicycleType: false,
    wheelType: false,
    priceInterval: false,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const queryParams = new URLSearchParams();
        Object.keys(selectedFilters).forEach((category) => {
          selectedFilters[category].forEach((item) => {
            queryParams.append(category, item);
          });
        });

        const response = await fetch(
          `https://bicycle.thegreenway.dk/api/bicycles/filtercounts?${queryParams.toString()}`
        );
        const data = await response.json();
        setFilters({
          gearSeries: data.gearSeriesCount,
          saddleBrand: data.saddleBrandCount,
          wheelBrand: data.wheelBrandCount,
          bicycleBrand: data.bicycleBrandCount,
          bicycleType: data.bicycleTypeCount,
          wheelType: data.wheelTypeCount,
          priceInterval: data.priceIntervalCount,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, [selectedFilters]);

  const fetchBicycles = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(selectedFilters).forEach((category) => {
        selectedFilters[category].forEach((item) => {
          queryParams.append(category, item);
        });
      });

      queryParams.append("minPrice", 0);
      queryParams.append("maxPrice", 18000);

      const response = await fetch(
        `https://bicycle.thegreenway.dk/api/bicycles/filterbicycles?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP-fejl! Status: ${response.status}`);
      }

      const data = await response.json();
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

  const [openBicycleDetails, setOpenBicycleDetails] = useState({});

  const toggleBicycleDetail = (bicycleId) => {
    setOpenBicycleDetails((prevDetails) => ({
      ...prevDetails,
      [bicycleId]: !prevDetails[bicycleId], // Skifter mellem true/false
    }));
  };

  const categoryTitles = {
    gearSeries: "Gear",
    saddleBrand: "Saddel",
    wheelBrand: "Hjul",
    bicycleBrand: "Mærke",
    bicycleType: "Geartype",
    wheelType: "Bremsetype",
    priceInterval: "Pris",
  };

  return (
    <Container>
      <Sidebar>
        {Object.keys(filters).map((category) => (
          <FilterCategory key={category}>
            <FilterTitle onClick={() => toggleCategory(category)}>
              {categoryTitles[category] ||
                category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterTitle>
            <FilterOptions isOpen={openCategories[category]}>
              {Object.keys(filters[category]).map((brand) => (
                <FilterButton
                  key={brand}
                  onClick={() =>
                    filters[category][brand] > 0 &&
                    handleFilterChange(category, brand)
                  }
                  selected={selectedFilters[category].includes(brand)}
                  disabled={filters[category][brand] === 0}
                >
                  <div className="checkbox">
                    {selectedFilters[category].includes(brand) && (
                      <span className="checkbox-icon">✔</span>
                    )}
                  </div>
                  {brand}
                  <span className="count">({filters[category][brand]})</span>
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
            <BicycleBox
              key={bicycle.id}
              onClick={() => toggleBicycleDetail(bicycle.id)}
            >
              <Tooltip className="tooltip">
                {openBicycleDetails[bicycle.id]
                  ? "Klik for at lukke detaljer"
                  : "Klik for detaljer"}
              </Tooltip>
              <BicycleBoxContent>
                <BicycleBrand>{bicycle.brand}</BicycleBrand>
                <BicycleTableContainer>
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
                        <BicycleTableData>Dealer:</BicycleTableData>
                        <BicycleTableData>
                          <StyledLink
                            href={bicycle.description}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            visit dealer
                          </StyledLink>
                        </BicycleTableData>
                      </BicycleTableRow>
                      <BicycleTableRow>
                        <BicycleTableData>Frame:</BicycleTableData>
                        <BicycleTableData>
                          {bicycle.frame?.model}
                        </BicycleTableData>
                      </BicycleTableRow>
                      {openBicycleDetails[bicycle.id] && (
                        <>
                          <BicycleTableRow>
                            <BicycleTableData>- weight:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.frame?.weight}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- material:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.frame?.material}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- model:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.frame?.type}
                            </BicycleTableData>
                          </BicycleTableRow>
                        </>
                      )}
                      <BicycleTableRow>
                        <BicycleTableData>Gear:</BicycleTableData>
                        <BicycleTableData>
                          {bicycle.gear?.model}
                        </BicycleTableData>
                      </BicycleTableRow>
                      {openBicycleDetails[bicycle.id] && (
                        <>
                          <BicycleTableRow>
                            <BicycleTableData>- type:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.gear?.type}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- weight:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.gear?.weight}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- material:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.gear?.material}
                            </BicycleTableData>
                          </BicycleTableRow>
                        </>
                      )}
                      <BicycleTableRow>
                        <BicycleTableData>Wheel:</BicycleTableData>
                        <BicycleTableData>
                          {bicycle.wheel?.model}
                        </BicycleTableData>
                      </BicycleTableRow>
                      {openBicycleDetails[bicycle.id] && (
                        <>
                          <BicycleTableRow>
                            <BicycleTableData>- weight:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.wheel?.weight}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- material:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.wheel?.material}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- rim:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.wheel?.size}
                            </BicycleTableData>
                          </BicycleTableRow>
                        </>
                      )}
                      <BicycleTableRow>
                        <BicycleTableData>Saddle:</BicycleTableData>
                        <BicycleTableData>
                          {bicycle.saddle?.model}
                        </BicycleTableData>
                      </BicycleTableRow>
                      {openBicycleDetails[bicycle.id] && (
                        <>
                          <BicycleTableRow>
                            <BicycleTableData>- weight:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.saddle?.weight}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- width:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.saddle?.width}
                            </BicycleTableData>
                          </BicycleTableRow>
                          <BicycleTableRow>
                            <BicycleTableData>- material:</BicycleTableData>
                            <BicycleTableData>
                              {bicycle.saddle?.material}
                            </BicycleTableData>
                          </BicycleTableRow>
                        </>
                      )}
                    </tbody>
                  </BicycleTable>
                </BicycleTableContainer>
              </BicycleBoxContent>
            </BicycleBox>
          ))
        )}
      </Content>
    </Container>
  );
};

export default Bicycles;
