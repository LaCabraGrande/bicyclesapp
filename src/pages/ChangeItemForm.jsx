import { useState } from "react";
import styled from "styled-components";
import facade from "../util/apiFacade";


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

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

const ChangeItemForm = ({ activeForm, onFormSelect }) => {
  if (activeForm !== "Change Item") return null; // Avoid rendering unnecessarily
  const [changeItemForm, setChangeItemForm] = useState(null);
  const [itemId, setItemId] = useState("");
  const [itemData, setItemData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeFormsConfig = {
    "Change Frame": { endpoint: "/frames", fields: ["brand", "model", "material", "type", "weight", "size"] },
    "Change Gear": { endpoint: "/gears", fields: ["brand", "model", "material", "type", "weight"] },
    "Change Wheel": { endpoint: "/wheels", fields: ["brand", "model", "material", "type", "weight", "size"] },
    "Change Saddle": { endpoint: "/saddles", fields: ["brand", "model", "material", "weight", "width"] },
  };

  const fetchItemData = async () => {
    if (!itemId || !changeItemForm) return;

    setIsFetching(true);
    const endpoint = `https://bicycle.thegreenway.dk/api${changeFormsConfig[changeItemForm].endpoint}/${itemId}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setItemData({ ...data });
    } catch (error) {
      console.error("Error fetching item data:", error);
      alert(`Failed to fetch ${changeItemForm} data.`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChangeItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemData) return;

    setIsSubmitting(true);
    const endpoint = `https://bicycle.thegreenway.dk/api${changeFormsConfig[changeItemForm].endpoint}/${itemId}`;

    try {
      await facade.fetchWithAuth(endpoint, "PUT", itemData);
      alert(`${changeItemForm.split(" ")[1]} updated successfully!`);
      setItemData(null);
      setItemId("");
    } catch (error) {
      console.error("Error updating item:", error);
      alert(`Failed to update ${changeItemForm}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeItemSelect = (formName) => {
    setChangeItemForm(formName);
    onFormSelect("Change Item");
    setItemId("");
    setItemData(null);
  };

  return (
    activeForm === "Change Item" &&
    changeItemForm && (
      <FormContainer>
        <h3>{changeItemForm}</h3>
        <Form onSubmit={handleChangeItemSubmit}>
          <label htmlFor="itemId">Enter {changeItemForm.split(" ")[1]} ID:</label>
          <Input
            type="number"
            name="itemId"
            placeholder={`Enter ${changeItemForm.split(" ")[1]} ID`}
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          />
          <SubmitButton type="button" onClick={fetchItemData} disabled={!itemId || isFetching}>
            {isFetching ? "Fetching..." : "Fetch Details"}
          </SubmitButton>

          {itemData &&
            changeFormsConfig[changeItemForm].fields.map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <Input
                  type="text"
                  name={field}
                  value={itemData[field] || ""}
                  onChange={handleItemChange}
                  placeholder={`Enter ${field}`}
                  required
                />
              </div>
            ))}

          {itemData && (
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : `Update ${changeItemForm.split(" ")[1]}`}
            </SubmitButton>
          )}
        </Form>
      </FormContainer>
    )
  );
};

export default ChangeItemForm;

