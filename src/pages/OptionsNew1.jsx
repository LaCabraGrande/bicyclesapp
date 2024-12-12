import { useState, useEffect } from "react";
import styled from "styled-components";
import facade from "../util/apiFacade";

const ActionButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;

  &:hover {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  }
`;

const StyledButton = styled.button`
  width: 90%;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #007acc;
    color: white;
  }
`;

const FormContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007acc;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #005fa3;
  }
`;

const Options = ({ onFormSelect, activeForm }) => {
  const [isNewItemsExpanded, setIsNewItemsExpanded] = useState(false);
  const [isAddItemsExpanded, setIsAddItemsExpanded] = useState(false);
  const [addComponents, setAddComponents] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    frames: [],
    gears: [],
    wheels: [],
    saddles: [],
  });
  const [bicycles, setBicycles] = useState([]);
  const [selectedBicycleId, setSelectedBicycleId] = useState(null);
  const [bicycleDetails, setBicycleDetails] = useState(null);

  const formsConfig = {
    "New Bicycle": {
      endpoint: "/bicycles",
      fields: ["brand", "model", "size", "price", "weight", "description"],
    },
    "New Frame": {
      endpoint: "/frames",
      fields: ["brand", "material", "type", "weight", "size"],
    },
    "New Gear": {
      endpoint: "/gears",
      fields: ["brand", "model", "material", "type", "weight"],
    },
    "New Wheels": {
      endpoint: "/wheels",
      fields: ["brand", "material", "type", "model", "weight", "size"],
    },
    "New Saddle": {
      endpoint: "/saddles",
      fields: ["brand", "material", "model", "weight", "width"],
    },
  };

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

    const fetchBicycles = async () => {
      try {
        const res = await fetch("https://bicycle.thegreenway.dk/api/bicycles");
        const data = await res.json();
        setBicycles(data);
      } catch (error) {
        console.error("Error fetching bicycles:", error);
      }
    };

    fetchFilters();
    fetchBicycles();
  }, []);

  const toggleNewItems = () => {
    setIsNewItemsExpanded((prev) => !prev);
    setIsAddItemsExpanded(false);
    onFormSelect("");
  };

  const toggleAddItems = () => {
    setIsAddItemsExpanded((prev) => !prev);
    setIsNewItemsExpanded(false);
    onFormSelect("");
  };

  const handleBicycleSelect = async (id) => {
    setSelectedBicycleId(id);
    try {
      const res = await fetch(`https://bicycle.thegreenway.dk/api/bicycles/${id}`);
      const data = await res.json();
      setBicycleDetails(data);
      setFormData({
        brand: data.brand,
        model: data.model,
        size: data.size,
        price: data.price,
        weight: data.weight,
        description: data.description,
        frameId: data.frame.id,
        gearId: data.gear.id,
        wheelId: data.wheel.id,
        saddleId: data.saddle.id,
      });
    } catch (error) {
      console.error("Error fetching bicycle details:", error);
    }
  };

  const handleFormSelect = (formName) => {
    onFormSelect(formName);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBicycleId) {
        alert("No bicycle selected!");
        return;
    }

    try {
        const endpoint = `/bicycles/alldetails/${selectedBicycleId}`;
        console.log("Submitting form data to:", endpoint);
        console.log("Form Data:", formData);

        const response = await facade.fetchWithAuth(endpoint, "PUT", formData);
        console.log("Bicycle updated successfully:", response);
        alert("Bicycle successfully updated!");
    } catch (error) {
        console.error("Error updating bicycle:", error);

        if (error.fullError) {
            // If the server returned detailed error information
            alert(`Failed to update bicycle: ${error.fullError.message || "Unknown error"}`);
        } else {
            // Generic error message
            alert(`Failed to update bicycle: ${error.message}`);
        }
    }
};

  if (activeForm === "Change Bicycle") {
    return (
      <FormContainer>
        <Select
          onChange={(e) => handleBicycleSelect(e.target.value)}
          value={selectedBicycleId || ""}
        >
          <option value="">Select Bicycle</option>
          {bicycles.map((bike) => (
            <option key={bike.id} value={bike.id}>
              {bike.brand} - {bike.model}
            </option>
          ))}
        </Select>

        {bicycleDetails && (
          <div>
            <h3>Bicycle Details</h3>
            <p>Brand: {bicycleDetails.brand}</p>
            <p>Model: {bicycleDetails.model}</p>
            <p>Size: {bicycleDetails.size}</p>
            <p>Price: {bicycleDetails.price}</p>
            <p>Weight: {bicycleDetails.weight}</p>
            <p>Description: {bicycleDetails.description}</p>
            <p>Frame: {bicycleDetails.frame.brand}</p>
            <p>Gear: {bicycleDetails.gear.brand}</p>
            <p>Wheels: {bicycleDetails.wheel.brand}</p>
            <p>Saddle: {bicycleDetails.saddle.brand}</p>
          </div>
        )}

        {bicycleDetails && (
          <Form onSubmit={handleChangeSubmit}>
            <Input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand || ""}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="model"
              placeholder="Model"
              value={formData.model || ""}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="size"
              placeholder="Size"
              value={formData.size || ""}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price || ""}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="weight"
              placeholder="Weight"
              value={formData.weight || ""}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description || ""}
              onChange={handleChange}
              required
            />

            <Select
              name="frameId"
              value={formData.frameId || ""}
              onChange={handleChange}
            >
              <option value="">Select Frame</option>
              {filters.frames.map((frame) => (
                <option key={frame.id} value={frame.id}>
                  {frame.brand}
                </option>
              ))}
            </Select>

            <Select
              name="gearId"
              value={formData.gearId || ""}
              onChange={handleChange}
            >
              <option value="">Select Gear</option>
              {filters.gears.map((gear) => (
                <option key={gear.id} value={gear.id}>
                  {gear.brand}
                </option>
              ))}
            </Select>

            <Select
              name="wheelId"
              value={formData.wheelId || ""}
              onChange={handleChange}
            >
              <option value="">Select Wheels</option>
              {filters.wheels.map((wheel) => (
                <option key={wheel.id} value={wheel.id}>
                  {wheel.brand}
                </option>
              ))}
            </Select>

            <Select
              name="saddleId"
              value={formData.saddleId || ""}
              onChange={handleChange}
            >
              <option value="">Select Saddle</option>
              {filters.saddles.map((saddle) => (
                <option key={saddle.id} value={saddle.id}>
                  {saddle.brand}
                </option>
              ))}
            </Select>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Change Bicycle"}
            </SubmitButton>
          </Form>
        )}
      </FormContainer>
    );
  }

  if (activeForm && formsConfig[activeForm]) {
    return (
      <Form onSubmit={handleSubmit}>
        {formsConfig[activeForm].fields.map((field) => (
          <Input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field] || ""}
            onChange={handleChange}
            required
          />
        ))}
        {activeForm === "New Bicycle" && (
          <>
            <ActionButton onClick={() => setAddComponents((prev) => !prev)}>
              {addComponents ? "Remove Components" : "Add More Components"}
            </ActionButton>
            {addComponents && (
              <>
                {Object.keys(filters).map((key) => (
                  <Select
                    key={key}
                    name={`${key.slice(0, -1)}Id`}
                    value={formData[`${key.slice(0, -1)}Id`] || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select {key.slice(0, -1)}</option>
                    {filters[key].map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.brand} - {item.model}
                      </option>
                    ))}
                  </Select>
                ))}
              </>
            )}
          </>
        )}
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : `Add ${activeForm}`}
        </SubmitButton>
      </Form>
    );
  }

  return (
    <div>
      <ActionButton onClick={toggleNewItems}>
        {isNewItemsExpanded ? "Close New Item" : "New Item"}
      </ActionButton>
      {isNewItemsExpanded &&
        Object.keys(formsConfig).map((formName) => (
          <StyledButton key={formName} onClick={() => handleFormSelect(formName)}>
            {formName}
          </StyledButton>
        ))}

      <ActionButton onClick={() => handleFormSelect("Change Bicycle")}>
        Change Bicycle
      </ActionButton>
      <ActionButton onClick={() => handleAction("Change Item")}>Change Item</ActionButton>
      <ActionButton onClick={() => handleAction("Delete Item")}>Delete Item</ActionButton>
    </div>
  );
};

export default Options;
