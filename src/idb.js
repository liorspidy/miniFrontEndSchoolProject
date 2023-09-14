/*
Daniel Gardashnik 206389363
Lior Fridman 206798902
*/

const idb = {
  // Enum for valid categories
  VALID_CATEGORIES: [
    'FOOD',
    'HEALTH',
    'EDUCATION',
    'TRAVEL',
    'HOUSING',
    'OTHER',
  ],

  // Asynchronously opens or creates an IndexedDB database
  async openCostsDB(databaseName, databaseVersion) {
    return new Promise((resolve, reject) => {
      // Open or create the IndexedDB database
      const request = indexedDB.open(databaseName, databaseVersion);

      // Handle database schema upgrades
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create an object store for storing cost items
        if (!db.objectStoreNames.contains('costs')) {
          db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
        }
      };

      // Handle successful database open
      request.onsuccess = (event) => {
        const db = event.target.result;

        // Attach the addCost function to the database object
        db.addCost = idb.addCost.bind(null, db);

        // Resolve with the opened database
        resolve(db);
      };

      // Handle errors during database open
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  // Asynchronously adds a new cost item to the database
  async addCost(db, costData) {
    return new Promise((resolve, reject) => {
      // Validate the costData object
      if (
        !costData ||
        typeof costData !== 'object' ||
        !(
          'sum' in costData &&
          (typeof costData.sum === 'number' || typeof costData.sum === 'string')
        ) ||
        !(
          'category' in costData &&
          idb.VALID_CATEGORIES.includes(costData.category)
        ) ||
        !(
          'description' in costData && typeof costData.description === 'string'
        ) ||
        Object.keys(costData).some(
          (key) =>
            key !== 'sum' &&
            key !== 'category' &&
            key !== 'description' &&
            key !== 'date'
        )
      ) {
        reject(new Error('Invalid costData object'));
        return;
      }

      // Start a read-write transaction for the 'costs' object store
      const transaction = db.transaction('costs', 'readwrite');
      const store = transaction.objectStore('costs');

      // Add the provided cost data to the object store
      const request = store.add(costData);

      // Handle the success of adding the cost
      request.onsuccess = (event) => {
        resolve(true);
      };

      // Handle errors during cost addition
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },
};

// Export the idb object
if (typeof module !== 'undefined') {
  module.exports = idb;
}
