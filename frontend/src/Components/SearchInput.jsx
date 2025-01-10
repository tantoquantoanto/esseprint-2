import { useState } from "react";
import { Form } from "react-bootstrap";

const SearchInput = ({ onSearchResults, onResetSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
  

    if (!value.trim()) {
      onResetSearch();
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/products?name=${value}`);
      

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
  
      const data = await response.json();
  
      if (data.products) {
        onSearchResults(data.products);
      } else {
        onResetSearch(); 
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      onResetSearch(); 
    }
  };
  

  return (
    <Form >
      <Form.Control
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={handleInputChange}
      />
    </Form>
  );
};

export default SearchInput;
