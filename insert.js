const db = require('./models/db');

(async () => {
  try {
    await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2)",
      ['Ravi', 'ravi@example.com']
    );
    console.log('✅ User inserted');
  } catch (err) {
    console.error('Insert error:', err);
  } finally {
    process.exit();
  }
})();
