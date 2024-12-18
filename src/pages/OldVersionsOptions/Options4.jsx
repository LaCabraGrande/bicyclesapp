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
  background-color: #f9f9f9;
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
  background-color: white;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
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

const Options = ({ onFormSelect, activeForm, username }) => { // Assuming username is passed as a prop
    const [isNewItemsExpanded, setIsNewItemsExpanded] = useState(false);
    const [isAddItemsExpanded, setIsAddItemsExpanded] = useState(false);
    const [isChangeItemsExpanded, setIsChangeItemsExpanded] = useState(false);
  
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
    const [formKey, setFormKey] = useState(0);
  
    //Delete ITEMS
    const [isDeleteItemsExpanded, setIsDeleteItemsExpanded] = useState(false);
    const [selectedDeleteType, setSelectedDeleteType] = useState(null); // Current type to delete
    const [deleteItems, setDeleteItems] = useState([]); // List of items for dropdown
    const [selectedItemIdToDelete, setSelectedItemIdToDelete] = useState(null); // ID of the item to delete
  
    // Toggle Delete Items section visibility
    const toggleDeleteItems = () => {
      setIsDeleteItemsExpanded((prev) => !prev);
      setSelectedDeleteType(null); // Reset selected type
      setDeleteItems([]); // Clear previous items
    };
  
  // Handle selection of delete type and fetch the relevant items
  const handleDeleteTypeSelect = async (deleteType) => {
    setSelectedDeleteType(deleteType); // Set the type of item to delete
    setSelectedItemIdToDelete(null); // Reset selected item ID
    setDeleteItems([]); // Clear previous items

    try {
      const endpointMap = {
        "Delete Bicycle": `/bicycles/createdByUser/${username}`,
        "Delete Frame": `/frames/createdByUser/${username}`,
        "Delete Gear": `/gears/createdByUser/${username}`,
        "Delete Wheel": `/wheels/createdByUser/${username}`,
        "Delete Saddle": `/saddles/createdByUser/${username}`,
      };

      const endpoint = endpointMap[deleteType];
      console.log("Fetching data from endpoint:", endpoint); // Debug log

      const data = await fetchWithAuth(endpoint);
      console.log("Fetched data for delete:", data); // Debug log
      setDeleteItems(data); // Update deleteItems state
    } catch (error) {
      console.error(`Error fetching items for ${deleteType}:`, error);
      alert(`Failed to fetch items for ${deleteType}.`);
    }
  };

  useEffect(() => {
    const fetchItemsDelete = async () => {
      try {
        // Map endpoints based on activeForm
        const endpointMap = {
          "Delete Bicycle": `/bicycles/createdByUser/${username}`,
          "Delete Frame": `/frames/createdByUser/${username}`,
          "Delete Gear": `/gears/createdByUser/${username}`,
          "Delete Wheel": `/wheels/createdByUser/${username}`,
          "Delete Saddle": `/saddles/createdByUser/${username}`,
        };

        const endpoint = endpointMap[activeForm]; // Derive endpoint dynamically
        if (!endpoint) return; // Guard clause for invalid activeForm

        const data = await fetchWithAuth(endpoint);
        console.log(`Fetched items for ${activeForm}:`, data); // Debugging
        setDeleteItems(data); // Update the dropdown options
      } catch (error) {
        console.error(`Error fetching items for ${activeForm}:`, error);
      }
    };

    if (activeForm && activeForm.startsWith("Delete")) {
      fetchItemsDelete(); // Fetch items when activeForm starts with "Delete"
    }
  }, [activeForm, username]); // Add username as a dependency

  // Handle item deletion
  const handleDeleteItem = async () => {
    if (!selectedItemIdToDelete) {
      alert("Please select an item to delete.");
      return;
    }

    try {
      const endpointMap = {
        "Delete Bicycle": `/bicycles`,
        "Delete Frame": `/frames`,
        "Delete Gear": `/gears`,
        "Delete Wheel": `/wheels`,
        "Delete Saddle": `/saddles`,
      };

      const endpoint = endpointMap[selectedDeleteType];
      await fetchWithAuth(`${endpoint}/${selectedItemIdToDelete}`, "DELETE");
      alert(`${selectedDeleteType.split(" ")[1]} deleted successfully!`);

      // Refresh the dropdown after deletion
      handleDeleteTypeSelect(selectedDeleteType);
      setSelectedItemIdToDelete(null); // Clear selection
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete the selected item. Please try again.");
    }
  };

  const changeFormsConfig = {
    "Change Frame": {
      endpoint: "/frames",
      fields: ["brand", "model", "material", "type", "weight", "size"],
    },
    "Change Gear": {
      endpoint: "/gears",
      fields: ["brand", "model", "material", "type", "weight"],
    },
    "Change Wheel": {
      endpoint: "/wheels",
      fields: ["brand", "model", "material", "type", "weight", "size"],
    },
    "Change Saddle": {
      endpoint: "/saddles",
      fields: ["brand", "model", "material", "weight", "width"],
    },
  };

  const formsConfig = {
    "New Bicycle": {
      endpoint: "/bicycles",
      fields: [
        "bicycle_brand",
        "bicycle_model",
        "bicycle_size",
        "bicycle_price",
        "bicycle_weight",
        "bicycle_description",
      ],
    },
    "New Frame": {
      endpoint: "/frames",
      fields: [
        "frame_brand",
        "frame_model",
        "frame_material",
        "frame_type",
        "frame_weight",
        "frame_size",
      ],
    },
    "New Gear": {
      endpoint: "/gears",
      fields: [
        "gear_brand",
        "gear_model",
        "gear_material",
        "gear_type",
        "gear_weight",
      ],
    },
    "New Wheels": {
      endpoint: "/wheels",
      fields: [
        "wheel_brand",
        "wheel_material",
        "wheel_type",
        "wheel_model",
        "wheel_weight",
        "wheel_size",
      ],
    },
    "New Saddle": {
      endpoint: "/saddles",
      fields: [
        "saddle_brand",
        "saddle_material",
        "saddle_model",
        "saddle_weight",
        "saddle_width",
      ],
    },
  };

  const [items, setItems] = useState([]); // List of items for dropdown
  const [selectedItemId, setSelectedItemId] = useState(null); // Selected item ID

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const formConfig = changeFormsConfig[activeForm];
        const response = await fetch(
          `https://bicycle.thegreenway.dk/api${formConfig.endpoint}`
        );
        const data = await response.json();
        setItems(data); // Populate the dropdown
      } catch (error) {
        console.error(`Error fetching ${activeForm} items:`, error);
      }
    };
    if (activeForm) fetchItems();
  }, [activeForm]);

  const handleItemSelect = async (id) => {
    setSelectedItemId(id);
    if (!id) return;

    try {
      const formConfig = changeFormsConfig[activeForm];
      const response = await fetch(
        `https://bicycle.thegreenway.dk/api${formConfig.endpoint}/${id}`
      );
      const data = await response.json();
      setFormData(data); // Populate formData with fetched details
    } catch (error) {
      console.error(`Error fetching item details for ${activeForm}:`, error);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [framesRes, gearsRes, wheelsRes, saddlesRes] = await Promise.all([
          fetch("https://bicycle.thegreenway.dk/api/frames").then((res) =>
            res.json()
          ),
          fetch("https://bicycle.thegreenway.dk/api/gears").then((res) =>
            res.json()
          ),
          fetch("https://bicycle.thegreenway.dk/api/wheels").then((res) =>
            res.json()
          ),
          fetch("https://bicycle.thegreenway.dk/api/saddles").then((res) =>
            res.json()
          ),
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

  const toggleChangeItems = () => {
    setIsChangeItemsExpanded((prev) => !prev);
    setIsNewItemsExpanded(false);
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
      const res = await fetch(
        `https://bicycle.thegreenway.dk/api/bicycles/${id}`
      );
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
    onFormSelect(formName); // Select the form
    setFormKey((prevKey) => prevKey + 1); // Force form re-render
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formConfig = formsConfig[activeForm];
    if (!formConfig) return;

    try {
      if (activeForm === "New Bicycle" && addComponents) {
        // Submitting a bicycle with components
        const endpoint = "/bicycles/withcomponents";
        const payload = {
          ...formData,
          frameId: parseInt(formData.frameId),
          gearId: parseInt(formData.gearId),
          wheelId: parseInt(formData.wheelId),
          saddleId: parseInt(formData.saddleId),
        };
        console.log("endpoint:", endpoint);
        console.log("payload:", payload);
        await facade.fetchWithAuth(endpoint, "POST", payload);
      } else if (activeForm === "New Bicycle") {
        // Submitting a bicycle without components
        const endpoint = "/bicycles";
        console.log("endpoint:", endpoint);
        console.log("formData:", formData);
        await facade.fetchWithAuth(endpoint, "POST", formData);
      } else {
        // Generic submission for other forms
        await facade.fetchWithAuth(formConfig.endpoint, "POST", formData);
      }

      alert(`${activeForm} successfully added!`);
      setFormData({});
      onFormSelect("");
    } catch (error) {
      console.error(`Error adding ${activeForm.toLowerCase()}:`, error);
      alert(`Failed to add ${activeForm.toLowerCase()}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
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
        alert(
          `Failed to update bicycle: ${
            error.fullError.message || "Unknown error"
          }`
        );
      } else {
        // Generic error message
        alert(`Failed to update bicycle: ${error.message}`);
      }
    }
  };

  const handleChangeItemSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formConfig = changeFormsConfig[activeForm];
    if (!formConfig) return;

    try {
      console.log(`Submitting to ${formConfig.endpoint}:`, formData);
      await facade.fetchWithAuth(formConfig.endpoint, "PUT", formData);
      alert(`${activeForm} updated successfully!`);
      setFormData({});
      onFormSelect(""); // Reset active form
    } catch (error) {
      console.error(`Error updating ${activeForm}:`, error);
      alert(`Failed to update ${activeForm}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeForm === "Change Bicycle") {
    return (
      <FormContainer>
        <label htmlFor="bicycleSelect">Select Bicycle: </label>
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

        {bicycleDetails && <div>{/* Kommentareret indhold fjernet */}</div>}

        {bicycleDetails && (
          <Form key={formKey} onSubmit={handleChangeSubmit}>
            <div>
              <label htmlFor="brand">Brand: </label>
              <Input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="model">Model: </label>
              <Input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="size">Size: </label>
              <Input
                type="number"
                name="size"
                placeholder="Size"
                value={formData.size || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="price">Price: </label>
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="weight">Weight: </label>
              <Input
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="description">Description: </label>
              <Input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="frameId">Frame: </label>
              <Select
                name="frameId"
                value={formData.frameId || ""}
                onChange={handleChange}
              >
                <option value="">Select Frame</option>
                {filters.frames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.model}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="gearId">Gear: </label>
              <Select
                name="gearId"
                value={formData.gearId || ""}
                onChange={handleChange}
              >
                <option value="">Select Gear</option>
                {filters.gears.map((gear) => (
                  <option key={gear.id} value={gear.id}>
                    {gear.model}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="wheelId">Wheels: </label>
              <Select
                name="wheelId"
                value={formData.wheelId || ""}
                onChange={handleChange}
              >
                <option value="">Select Wheels</option>
                {filters.wheels.map((wheel) => (
                  <option key={wheel.id} value={wheel.id}>
                    {wheel.model}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="saddleId">Saddle: </label>
              <Select
                name="saddleId"
                value={formData.saddleId || ""}
                onChange={handleChange}
              >
                <option value="">Select Saddle</option>
                {filters.saddles.map((saddle) => (
                  <option key={saddle.id} value={saddle.id}>
                    {saddle.model}
                  </option>
                ))}
              </Select>
            </div>

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
      <Form key={formKey} onSubmit={handleSubmit}>
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
            {/* <ActionButton onClick={() => setAddComponents((prev) => !prev)}>
              {addComponents ? "Remove Components" : "Add More Components"}
            </ActionButton>
            {addComponents && (
              <> */}
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
            {/* </>
            )} */}
          </>
        )}
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : `Add ${activeForm}`}
        </SubmitButton>
      </Form>
    );
  }

// Change ITEM
  if (activeForm && changeFormsConfig[activeForm]) {
    return (
      <>
        {/* Step 2: Dropdown for Selecting an Item */}
        <FormContainer>
          <label htmlFor="itemSelect">
            Select {activeForm.split(" ")[1]}:{" "}
          </label>
          <Select
            id="itemSelect"
            onChange={(e) => handleItemSelect(e.target.value)}
            value={selectedItemId || ""}
            required
          >
            <option value="">Select {activeForm.split(" ")[1]}</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.brand} - {item.model}
              </option>
            ))}
          </Select>
        </FormContainer>

        {/* Step 3: Form for Editing the Selected Item */}
        {selectedItemId && (
          <Form onSubmit={handleChangeItemSubmit}>
            {changeFormsConfig[activeForm].fields.map((field) => (
              <div key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <Input
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : `Update ${activeForm.split(" ")[1]}`}
            </SubmitButton>
          </Form>
        )}
      </>
    );
  }

  // Delete Items Logic
  if (activeForm && activeForm.startsWith("Delete")) {
    return (
      <>
        {/* Step 2: Dropdown for Selecting an Item */}
        <FormContainer>
  <label htmlFor="deleteSelect">
    Select {selectedDeleteType ? selectedDeleteType.split(" ")[1] : ""} to Delete:
  </label>
  <Select
    id="deleteSelect"
    onChange={(e) => setSelectedItemIdToDelete(e.target.value)}
    value={selectedItemIdToDelete || ""}
    required
  >
    <option value="">Select {selectedDeleteType ? selectedDeleteType.split(" ")[1] : ""}</option>
    {deleteItems.length > 0 ? (
      deleteItems.map((item) => (
        <option key={item.id} value={item.id}>
          {item.brand} - {item.model}
        </option>
      ))
    ) : (
      <option disabled>No items found</option>
    )}
  </Select>
</FormContainer>
  
        {/* Step 3: Delete Button */}
        {selectedItemIdToDelete && (
          <FormContainer>
            <SubmitButton onClick={handleDeleteItem}>
              Delete {selectedDeleteType?.split(" ")[1]}
            </SubmitButton>
          </FormContainer>
        )}
      </>
    );
  }
  
  
  
  

  return (
    <div>
      <ActionButton onClick={toggleNewItems}>
        {isNewItemsExpanded ? "Close New Item" : "New Item"}
      </ActionButton>
      {isNewItemsExpanded &&
        Object.keys(formsConfig).map((formName) => (
          <StyledButton
            key={formName}
            onClick={() => handleFormSelect(formName)}
          >
            {formName}
          </StyledButton>
        ))}

        {/* Change Items Section */}
      <ActionButton onClick={() => handleFormSelect("Change Bicycle")}>
        Change Bicycle
      </ActionButton>

      {/* Change Items Section */}
      <ActionButton onClick={toggleChangeItems}>
        {isChangeItemsExpanded ? "Close Change Item" : "Change Item"}
      </ActionButton>
      {isChangeItemsExpanded &&
        Object.keys(changeFormsConfig).map((formName) => (
          <StyledButton
            key={formName}
            onClick={() => handleFormSelect(formName)}
          >
            {formName}
          </StyledButton>
        ))}

{/* Delete Items Section */}
<ActionButton onClick={toggleDeleteItems}>
  {isDeleteItemsExpanded ? "Close Delete Item" : "Delete Item"}
</ActionButton>

{/* Render buttons dynamically */}
{isDeleteItemsExpanded &&
  ["Delete Bicycle", "Delete Frame", "Delete Gear", "Delete Wheel", "Delete Saddle"].map(
    (deleteType) => (
      <StyledButton
        key={deleteType}
        onClick={() => {
          handleDeleteTypeSelect(deleteType); // Fetch items for the delete type
          onFormSelect(deleteType); // Set activeForm to render in content area
        }}
      >
        {deleteType}
      </StyledButton>
    )
  )}
    </div>
  );
};

export default Options;
