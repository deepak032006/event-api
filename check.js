const db = require('./models/db'); // Make sure this path is correct

(async () => {
  try {
    const result = await db.query('SELECT * FROM users');
    console.log('Users:', result.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
})();
