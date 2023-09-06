import { useState } from 'react';
import classes from './CostForm.module.css';
import idb from '../idb';

// Define the CostForm component
const CostForm = ({ onAddCost, categories }) => {
  // Define state variables for form inputs and error handling
  const [sum, setSum] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!sum || !category || !description) {
      setError('Please fill in all mandatory fields');
      return;
    }

    setError('');

    // Get the current date in ISO format
    const currentDate = new Date().toISOString().split('T')[0];

    // Create a new cost object with user input
    const newCost = {
      sum: parseFloat(sum),
      category,
      description,
      date: date ? new Date(date).toISOString().split('T')[0] : currentDate,
    };

    try {
      // Open IndexedDB and add the new cost
      const db = await idb.openCostsDB('costsdb', 1);
      const result = await db.addCost(newCost);

      // If adding the cost was successful, reset form inputs
      if (result) {
        onAddCost(newCost);
        setSum('');
        setCategory('');
        setDescription('');
        setDate('');
      }
    } catch (error) {
      console.error('Error adding cost to IndexedDB:', error);
    }
  };

  // Render the CostForm component
  return (
    <div className={classes.formContainer}>
      <h2>Add New Cost Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Input field for the cost sum */}
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>
            <span className={classes.mandatory}>* </span>Sum:
          </label>
          <input
            className={classes.formInput}
            type="number"
            value={sum}
            onChange={(e) => setSum(e.target.value)}
          />
        </div>

        {/* Dropdown for selecting the cost category */}
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>
            <span className={classes.mandatory}>* </span>Category:
          </label>
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

        {/* Textarea for entering cost description */}
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>
            <span className={classes.mandatory}>* </span>Description:
          </label>
          <textarea
            className={classes.textareaInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Input field for selecting the cost date */}
        <div className={classes.inputBox}>
          <label className={classes.formLabel}>Date:</label>
          <input
            className={classes.formInput}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {/* Display error message if there is an error */}
          {error && <p className={classes.errorMessage}>{error}</p>}
        </div>

        {/* Submit button */}
        <button className={classes.formButton} type="submit">
          Add Cost
        </button>
      </form>
    </div>
  );
};

export default CostForm;
