import React, { useState, useEffect } from "react";
import classes from "./Main.module.css";
import CostForm from "./CostForm";
import CostReport from "./CostReport";
import idb from "../utils/idb";

const Main = () => {
  const [costs, setCosts] = useState([]);

  const handleAddCost = (newCost) => {
    setCosts([...costs, newCost]);
  };

  useEffect(() => {
    async function fetchCostsFromIndexedDB() {
      try {
        const db = await idb.openDB("costsdb", 1);
        const transaction = db.transaction("costs", "readonly");
        const costStore = transaction.objectStore("costs");

        const cursor = costStore.openCursor();

        const fetchedCosts = [];
        cursor.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            fetchedCosts.push(cursor.value);
            cursor.continue();
          } else {
            setCosts(fetchedCosts);
          }
        };

        cursor.onerror = (event) => {
          console.error(
            "Error fetching costs from IndexedDB:",
            event.target.error
          );
        };
      } catch (error) {
        console.error("Error opening IndexedDB:", error);
      }
    }

    fetchCostsFromIndexedDB();
  }, []);

  const categories = [
    "FOOD",
    "HEALTH",
    "EDUCATION",
    "TRAVEL",
    "HOUSING",
    "OTHER",
  ];

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
