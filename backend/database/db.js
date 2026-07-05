const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./database/interview.db",
  (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(
        "Connected to SQLite Database"
      );
    }
  }
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      technical INTEGER,
      communication INTEGER,
      problemSolving INTEGER,
      behavioral INTEGER,
      readiness INTEGER,
      report TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;