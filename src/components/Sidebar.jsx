import React, { useState, useEffect } from "react";
import "../styles/sidebar.css";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import searchIcon from "../assets/search-icon.svg";
import UnionLogo from "../assets/Union.svg";
import IngredientsIcon from "../assets/Ingredients Icon.svg";
import DoubleCaratLogo from "../assets/Double-Carat.svg";
import { useNavigate } from "react-router";

const Sidebar = ({ ingredients, addIngredient, removeIngredient, searchRecipes }) => {
  const [newIngredient, setNewIngredient] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();


   const handleLogoClick = () => {
     navigate("/"); // Redirect to the loading page
   };
  // Function to toggle the collapsed state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    setIsLogoVisible(!isLogoVisible);
  };
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      addIngredient(newIngredient);
      setNewIngredient("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleImageUpload = async (base64Image) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Uploading image for detection');
      const response = await axios.post(
        "https://chefmate-official-backend.onrender.com/api/detect",
        {
          imageBase64: base64Image,
        }
      );
      console.log('Detected objects:', response.data.detectedObjects);
      const detectedIngredients = response.data.detectedObjects;
      // Ensure only the detected objects are added to the ingredients list
      detectedIngredients.forEach((ingredient) => {
        addIngredient(ingredient);
      });
    } catch (error) {
      console.error('Error detecting ingredients:', error);
      setError("Error detecting ingredients. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isSidebarCollapsed && (
          <img src="/Logo.svg" alt="Logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}/>
        )}
        {isSidebarCollapsed && (
          <div className="logo-container">
            <img className="chef-logo" src={UnionLogo} alt="Chef Logo" />
            <img
              className="logo"
              src={IngredientsIcon}
              alt="Ingredients Icon"
              onClick={toggleSidebar}
            />
          </div>
        )}

        {!isSidebarCollapsed ? (
          <img
            className="double-carat-logo"
            src={DoubleCaratLogo}
            alt="Double Carat Logo"
            onClick={toggleSidebar} /* Make the image clickable */
          />
        ) : null}
      </div>
      {!isSidebarCollapsed && (
        <div id="ingredients-box" className="ingredients-box">
          <div className="search-bar-container">
            <div className="search-bar">
              <img className="search-icon" src={searchIcon} alt="Search" />
              <input
                className="ingredients-input"
                type="text"
                placeholder="Add ingredients manually..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="add-btn" onClick={handleAddIngredient}>
                Add
              </button>
            </div>
          </div>
          <div className="text-center or-text">or</div>
          <ImageUpload handleImageUpload={handleImageUpload} />
          {error && <p className="error">{error}</p>}
          {isLoading && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          )}
          <p className="assumption text-center">
            We assume you already have salt, pepper, & water.
          </p>
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                {ingredient}
                <button
                  className="remove-btn"
                  onClick={() => removeIngredient(ingredient)}
                ></button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;




