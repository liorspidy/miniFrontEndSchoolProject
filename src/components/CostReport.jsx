import { useState } from "react";
import classes from "./CostReport.module.css";
import "./calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";

const CostReport = ({ categories, costs }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortByCategory, setSortByCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");

  const handleSortByCategoryChange = (event) => {
    setSortByCategory(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
  };

  const filteredCosts = costs.filter((cost) => {
    const costDate = new Date(cost.date);
    const isDateMatch =
      !selectedDate ||
      (costDate.getFullYear() === selectedDate.getFullYear() &&
        costDate.getMonth() === selectedDate.getMonth());

    const isCategoryMatch = !sortByCategory || cost.category === sortByCategory;

    return isDateMatch && isCategoryMatch;
  });

  const sortedCosts = filteredCosts.sort((a, b) => {
    const orderMultiplier = sortOrder === "ascending" ? 1 : -1;
    return orderMultiplier * (a.sum - b.sum);
  });

  return (
    <div className={classes.costReport}>
      <h2>Cost Report</h2>
      <div className={classes.filterContainer}>
        <DatePicker
          format="MM/y"
          value={selectedDate}
          onChange={setSelectedDate}
          className={classes.datePicker}
          calendarIcon={null}
          clearIcon={null}
          showLeadingZeros
        />
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
        <button onClick={handleSortOrderChange}>
          {sortOrder === "ascending" ? "Ascending" : "Descending"}
        </button>
      </div>
      {sortedCosts.length > 0 && (
        <div className={classes.costList}>
          {sortedCosts.map((cost, index) => (
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
                <span className={classes.valueStyle}>
                  {new Date(cost.date).toLocaleDateString("en-GB")}
                </span>
              </li>
              <li>
                <span className={classes.valueStyle}>{cost.description}</span>
              </li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default CostReport;
