import React, { useState } from "react";
import classes from "./CostForm.module.css";
import idb from "../utils/idb";

const CostForm = ({ onAddCost, categories }) => {
  const [sum, setSum] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sum || !category || !description || !date) {
      setError("Please fill in all fields");
      return;
    }

    setError(""); // Clear the error message

    const newCost = {
      sum: parseFloat(sum),
      category,
      description,
      date: new Date(date).toISOString(),
    };

    try {
      const result = await idb.addCost(newCost);

      if (result === "Cost added successfully") {
        onAddCost(newCost);
        setSum("");
        setCategory("");
        setDescription("");
        setDate("");
      }
    } catch (error) {
      console.error("Error adding cost to IndexedDB:", error);
    }
  };

  return (
    <div className={classes.formContainer}>
      <h2>Add New Cost Item</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>Sum:</label>
          <input
            className={classes.formInput}
            type="number"
            value={sum}
            onChange={(e) => setSum(e.target.value)}
          />
        </div>
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>Category:</label>
          <select
            className={classes.formSelect}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option className={classes.emptyOption} value="">
              Please Choose a Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>Description:</label>
          <textarea
            className={classes.textareaInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>Date:</label>
          <input
            className={classes.formInput}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {error && <p className={classes.errorMessage}>{error}</p>}
        </div>

        <button className={classes.formButton} type="submit">
          Add Cost
        </button>
      </form>
    </div>
  );
};

export default CostForm;
