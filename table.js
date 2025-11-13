const db = require('./models/db');

async function createTables() {
  const conn = await db.getConnection();
  try {

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('customer','banker') NOT NULL DEFAULT 'customer',
        access_token VARCHAR(64),
        balance DECIMAL(15,2) NOT NULL DEFAULT 0.00
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('deposit','withdraw') NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        balance_after DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

createTables();
