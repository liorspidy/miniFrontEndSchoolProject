/*
Daniel Gardashnik 206389363
Lior Fridman 206798902
*/

import { useState, useEffect } from 'react';
import classes from './Main.module.css';
import CostForm from './CostForm';
import CostReport from './CostReport';
import idb from '../idb';

const Main = () => {
  // Define state to manage costs data
  const [costs, setCosts] = useState([]);

  // Function to handle adding a new cost
  const handleAddCost = (newCost) => {
    setCosts([...costs, newCost]);
  };

  // Use useEffect to fetch costs from IndexedDB on component mount
  useEffect(() => {
    async function fetchCostsFromIndexedDB() {
      try {
        // Open IndexedDB and create a transaction
        const db = await idb.openCostsDB('costsdb', 1);
        const transaction = db.transaction('costs', 'readonly');
        const costStore = transaction.objectStore('costs');

        // Open a cursor to retrieve costs from the store
        const cursor = costStore.openCursor();

        const fetchedCosts = [];
        cursor.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            fetchedCosts.push(cursor.value);
            cursor.continue();
          } else {
            // Set the retrieved costs in the component state
            setCosts(fetchedCosts);
          }
        };

        cursor.onerror = (event) => {
          console.error(
            'Error fetching costs from IndexedDB:',
            event.target.error
          );
        };
      } catch (error) {
        console.error('Error opening IndexedDB:', error);
      }
    }

    // Invoke the fetch function on component mount
    fetchCostsFromIndexedDB();
  }, []);

  // Define available cost categories
  const categories = [
    'FOOD',
    'HEALTH',
    'EDUCATION',
    'TRAVEL',
    'HOUSING',
    'OTHER',
  ];

  // Render the main component with CostForm and CostReport
  return (
    <div className={classes.main}>
      <div className={classes.mainContainer}>
        <h1 className={classes.mainTitle}>
          Front End Final Project - Cost Tracker
        </h1>
        <div className={classes.appField}>
          <CostForm onAddCost={handleAddCost} categories={categories} />
          <CostReport categories={categories} costs={costs} />
        </div>
      </div>
    </div>
  );
};

export default Main;
