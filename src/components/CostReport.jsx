import { useState } from 'react';
import classes from './CostReport.module.css';
import './calendar.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';

// Define the CostReport component
const CostReport = ({ categories, costs }) => {
  // Define state variables
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortByCategory, setSortByCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending');

  // Handle sorting by category change
  const handleSortByCategoryChange = (event) => {
    setSortByCategory(event.target.value);
  };

  // Handle sorting order change
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
  };

  // Filter costs based on selected date and category
  const filteredCosts = costs.filter((cost) => {
    const costDate = new Date(cost.date);
    const isDateMatch =
      !selectedDate ||
      (costDate.getFullYear() === selectedDate.getFullYear() &&
        costDate.getMonth() === selectedDate.getMonth());

    const isCategoryMatch = !sortByCategory || cost.category === sortByCategory;

    return isDateMatch && isCategoryMatch;
  });

  // Sort filtered costs based on sorting order
  const sortedCosts = filteredCosts.sort((a, b) => {
    const orderMultiplier = sortOrder === 'ascending' ? 1 : -1;
    return orderMultiplier * (a.sum - b.sum);
  });

  // Render the CostReport component
  return (
    <div className={classes.costReport}>
      <h2>Cost Report</h2>
      <div className={classes.filterContainer}>
        {/* Date picker */}
        <DatePicker
          format="MM/y"
          value={selectedDate}
          onChange={setSelectedDate}
          className={classes.datePicker}
          calendarIcon={null}
          clearIcon={null}
          showLeadingZeros
        />
        {/* Category select */}
        <select
          value={sortByCategory}
          onChange={handleSortByCategoryChange}
          className={classes.categorySelect}
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {/* Sorting order button */}
        <button onClick={handleSortOrderChange}>
          {sortOrder === 'ascending' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      {/* Render sorted cost items */}
      {sortedCosts.length > 0 && (
        <div className={classes.costList}>
          {sortedCosts.map((cost, index) => {
            const displayDate = cost.date
              ? new Date(cost.date).toLocaleDateString('en-GB')
              : new Date().toLocaleDateString('en-GB');

            return (
              <ul key={index} className={classes.costItem}>
                <li>
                  Sum: <span className={classes.valueStyle}>{cost.sum}</span>
                </li>
                <li>
                  Category:&nbsp;
                  <span className={classes.valueStyle}>{cost.category}</span>
                </li>
                <li>
                  Date: &nbsp;
                  <span className={classes.valueStyle}>{displayDate}</span>
                </li>
                <li>
                  <span className={classes.valueStyle}>{cost.description}</span>
                </li>
              </ul>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CostReport;
