const idb = {
  openDB: (name, version) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("costs")) {
          db.createObjectStore("costs", { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  addCost: (costData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await idb.openDB("costsdb", 1);
        const transaction = db.transaction("costs", "readwrite");
        const costStore = transaction.objectStore("costs");

        const request = costStore.add(costData);

        request.onsuccess = (event) => {
          resolve("Cost added successfully");
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default idb;
