const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

let isMongoConnected = false;
const DATA_FILE = path.join(__dirname, '../../data/db.json');

// Ensure data folder exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Memory / Persistent JSON Store
let localDb = {
  users: [],
  tests: [],
  questions: [],
  attempts: []
};

// Load existing local data if present
function loadLocalDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      localDb = JSON.parse(content);
    }
  } catch (err) {
    console.error('[DB] Error reading local db.json:', err.message);
  }
}

function saveLocalDb() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localDb, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error writing local db.json:', err.message);
  }
}

loadLocalDb();

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[DB] No MONGODB_URI specified. Operating with persistent local storage at backend/data/db.json.');
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    isMongoConnected = true;
    console.log('[DB] Successfully connected to MongoDB:', uri);
  } catch (err) {
    console.warn('[DB] Could not connect to MongoDB (' + err.message + '). Operating with persistent local storage at backend/data/db.json.');
    isMongoConnected = false;
  }
}

function getLocalStore() {
  return {
    data: localDb,
    save: saveLocalDb
  };
}

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  getLocalStore
};
