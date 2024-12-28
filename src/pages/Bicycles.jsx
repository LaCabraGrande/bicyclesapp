import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative; /* Gør Container til reference for absolut positionering */
  display: flex;
  flex-direction: column; /* Tilføj filter-div øverst */
  flex-wrap: nowrap; /* Hvis du vil forhindre brydning */
  overflow-x: hidden; /* For at tillade scrolling i stedet for overlap */
  overflow-y: hidden;
  height: 76vh;
  padding-top: 10px;
  margin: 0px 10px 10px 10px;
  background-image: url("cyclist-2-ny.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 860px) {
     border-right: none;
     height: 74vh;
    
  }

  @media (max-width: 460px) {
     height: 74vh;
     width: 100%;
     margin: 0;
  }
`;

const FilterDiv = styled.div`
  height: 30px;
  width: 100%;
  background-color: white;
  display: flex;   
  padding: 0px 0px 30px 30px; /* Plads til knappen */
  margin: 0px 0px 0px 0px;
  border-bottom: 1px solid #ddd; /* Tilsæt en bundlinje */
  position: relative;

  @media (max-width: 660px) {
    font-size: 0.8rem;    
  } 

  @media (max-width: 460px) {
    padding: 0px 0px 30px 20px; /* Plads til knappen */
    
  }  
`;

const BicycleCount = styled.div`
  position: absolute;
  left: 350px; /* Placerer tælleren 100px inde */
  color: black;
  font-size: 0.9rem;

  @media (max-width: 860px) {    
    left: 80%; /* Placerer tælleren 100px inde */
    font-size: 0.8rem;
  }

  @media (max-width: 660px) {    
    left: 75%; /* Placerer tælleren 100px inde */
    font-size: 0.8rem;
  }

  @media (max-width: 460px) {
    left: 75%; /* Placerer tælleren 100px inde */
    font-size: 0.8rem;
  }
`;

const SidebarContainer = styled.div`
  position: absolute;
  top: 36px;
  display: flex;
  left: ${(props) => (props.isOpen ? "0" : "-300px")};
  width: 320px;
  height: 77vh;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 0;
  overflow-y: auto;
  transition: left 0.4s ease;
  display: ${(props) => (props.isOpen || props.isMobile ? "block" : "none")};
  padding-left: 20px;
  margin-top: 20px;
  margin-left: 10px;
  border-right: 1px solid #ddd;  

  @media (max-width: 860px) {
    left: ${(props) => (props.isOpen ? "0" : "-101%")};
    width: 100%;
    border-right: none;    
    top: 30px;  
  }

  @media (max-width: 505px) {
    width: 100%; 
    padding-left: 0px;
    margin-left: 0%;
    top: 30px;
  }

  @media (max-width: 460px) {
     height: 74vh;
     width: 100%;
     margin: 0;
     padding-left: 0px; 
     top: 50px;  
  }

  @media (max-width: 400px) {
     
  }
`;

const Sidebar = styled.div`
  width: 280px; /* Standard bredde */
  max-width: 280px; /* Standard max bredde */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 73vh;
  margin-top: 5px;
  min-height: 63vh;
  padding-right: 20px;
  padding-top: 30px;
  padding-left: 10px;

  @media (max-width: 860px) {
    max-width: unset;;
    width: 98%;
    padding-left: 0px;  
  }

  @media (max-width: 505px) {
    max-width: unset;
    width: 100%; 
    padding-left: 20px;
  }

  @media (max-width: 450px) {
    max-width: unset;
    width: 100%; 
    padding-left: 20px;
  }   

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
  margin-left: ${(props) =>
    props.isMobile
      ? "0"
      : props.isOpen
      ? "325px"
      : "0"}; 
  transition: margin-left 0.4s ease; 
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 0fr));
  gap: 1rem;
  padding-left: 25px;
  margin-top: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  grid-auto-rows: minmax(290px, 290px);

  @media (max-width: 860px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 0;
    width: 100%;
  }
  
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
  
`;

const FilterTitleContainer = styled.div`
  margin-bottom: 0.5rem; 
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
`;

const FilterTitle = styled.h4`
  cursor: pointer;
  margin-left: 6px;
  margin-bottom: 5px;
  font-size: 1.1rem;
  font-weight: 400;
  color: black;
  position: relative;
  
 
  &::after {
    content: '';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%) ${(props) =>
      props.isOpen ? 'rotate(45deg)' : 'rotate(-135deg)'};
    width: 7px;
    height: 7px;
    border: solid 2px black;
    background: white;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }

  @media (max-width: 760px) {
    font-size: 1.1rem;
  }
`;

const FilterOptions = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-bottom: 20px;
`;

const SidebarButton = styled.button`
  background-color: white; 
  color: black; 
  border: none; 
  font-size: 0.9rem; 
  cursor: pointer; 
  border-radius: 5px;

  @media (max-width: 860px) {
    font-size: 0.8rem;
  }

  @media (max-width: 660px) {
    font-size: 0.8rem;
  }

  @media (max-width: 460px) {
    font-size: 0.8rem;
  }
`;

const FilterButton = styled.button`
  display: flex;
  z-index: 11; /* Sørg for, at knappen er over alt andet */
  align-items: center;
  background-color: transparent; 
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
      return props.disabled
        ? "#ddd" 
        : props.count === 0
        ? "#ddd" 
        : props.selected
        ? "#4CAF50" 
        : "white"; 
    }};

    @media (max-width: 760px) {
      font-size: 0.9rem; 
    }
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
    font-size: 0.7rem;
    color: ${(props) => (props.disabled ? "#bbb" : "#888")};
  }
`;

const BicycleBox = styled.div`
  min-height: 280px;
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
    visibility: visible; 
    opacity: 1;
  }
  
  @media (max-width: 435px) {
    width: 320px;
    padding: 0.5rem;
  }

`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 0.2rem; 
  right: 1.0rem; 
  color: black;
  text-align: center;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  transition: opacity 0.5s ease;
  pointer-events: none;

  @media (max-width: 1035px) {
   top: 0.2rem;
   font-size: 0.6rem;
   right: 1.0rem;
  }

`;

const BicycleBoxContent = styled.div`
  width: 295px;
  height: 255px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-right: 10px;  
  
  &::-webkit-scrollbar {
    width: 5px; 
  }
  &::-webkit-scrollbar-thumb {
    background-color: #45a049; 
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #45a049; 
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; 
  }

  @media (max-width: 435px) {
    width: 305px;
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
  max-height: 230px; 
  height: 230px;

  @media (max-width: 435px) {
    width: 100%;
  }
`;

const BicycleTable = styled.table`
  width: 280px;
  margin-top: 0.4rem;
  border-collapse: collapse;

  @media (max-width: 435px) {
    width: 290px;
  }
`;

const BicycleTableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const BicycleTableData = styled.td`
  font-size: 0.65rem;
  color: black;
  padding: 0.3rem;
 
  &:first-child {
    width: 29%; 
    text-align: left;
    font-weight: bold;
  }

  &:nth-child(2) {
    width: 71%; 
    text-align: left;
  }

  @media (max-width: 435px) {
    font-size: 0.60rem;
    &:first-child {
    width: 24%;     
    }
  }

  @media (max-width: 400px) {
    font-size: 0.60rem;
    &:first-child {
    width: 24%;     
    }
  }
`;

const StyledLink = styled.a`
  color: #45a049; 
  text-decoration: none;
  font-weight: bold;
  font-size: 0.7rem;

  &:hover {
    text-decoration: none;
    color: #0056b3; 
  }

  &:visited {
    color: #0056b3;
  }
`;

const Bicycles = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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
    priceInterval: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 860;
      setIsMobile(mobileView);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          priceInterval: data.priceIntervalCount,
          bicycleBrand: data.bicycleBrandCount,
          gearSeries: data.gearSeriesCount,
          wheelBrand: data.wheelBrandCount,
          saddleBrand: data.saddleBrandCount,
          bicycleType: data.bicycleTypeCount,
          wheelType: data.wheelTypeCount,
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
      <FilterDiv>
        <SidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen}>
          {isSidebarOpen ? "Close Filter" : "Filter"}
        </SidebarButton>
        <BicycleCount>{bicycles.length} Bicycles</BicycleCount>
      </FilterDiv>

      <SidebarContainer isOpen={isSidebarOpen} isMobile={isMobile}>
        <Sidebar>
          {Object.keys(filters).map((category) => (
            <FilterCategory key={category}>
              <FilterTitleContainer>
              <FilterTitle isOpen={openCategories[category]} onClick={() => toggleCategory(category)}>
                {categoryTitles[category] ||
                  category.charAt(0).toUpperCase() + category.slice(1)}
              </FilterTitle>
              </FilterTitleContainer>
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
      </SidebarContainer>

      <Content isOpen={isSidebarOpen} isMobile={isMobile}>
        {bicycles.length === 0 ? (
          <p>  </p>
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
