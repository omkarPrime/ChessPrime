const DB_NAME = 'focusforge-db';
const DB_VERSION = 1;

const STORES = {
  subjects: 'subjects',
  sessions: 'sessions',
  settings: 'settings',
};

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.subjects)) {
        const subjectStore = db.createObjectStore(STORES.subjects, {
          keyPath: 'id',
          autoIncrement: true,
        });
        subjectStore.createIndex('name', 'name', { unique: true });
      }

      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const sessionStore = db.createObjectStore(STORES.sessions, {
          keyPath: 'id',
          autoIncrement: true,
        });
        sessionStore.createIndex('date', 'date');
        sessionStore.createIndex('subjectId', 'subjectId');
      }

      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(storeName, mode, operation) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = operation(store);

    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAll(storeName) {
  return withStore(storeName, 'readonly', (store) => requestToPromise(store.getAll()));
}

export async function addRecord(storeName, value) {
  return withStore(storeName, 'readwrite', (store) => requestToPromise(store.add(value)));
}

export async function updateRecord(storeName, value) {
  return withStore(storeName, 'readwrite', (store) => requestToPromise(store.put(value)));
}

export async function deleteRecord(storeName, id) {
  return withStore(storeName, 'readwrite', (store) => requestToPromise(store.delete(id)));
}

export async function getSetting(key, fallback = null) {
  const result = await withStore(STORES.settings, 'readonly', (store) => requestToPromise(store.get(key)));
  return result ? result.value : fallback;
}

export async function setSetting(key, value) {
  return withStore(STORES.settings, 'readwrite', (store) => requestToPromise(store.put({ key, value })));
}

export { STORES };
