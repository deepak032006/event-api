const db = require('./db');

const createEvent = async ({ title, date_time, location, capacity }) => {
  const result = await db.query(
    `INSERT INTO events (title, date_time, location, capacity)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, date_time, location, capacity]
  );
  return result.rows[0];
};

const getEventById = async (eventId) => {
  const result = await db.query(
    `SELECT e.*, 
       json_agg(json_build_object('id', u.id, 'name', u.name, 'email', u.email)) AS registrations
     FROM events e
     LEFT JOIN registrations r ON e.id = r.event_id
     LEFT JOIN users u ON r.user_id = u.id
     WHERE e.id = $1
     GROUP BY e.id`,
    [eventId]
  );
  return result.rows[0];
};

const registerUserForEvent = async (eventId, userId) => {
  await db.query(
    `INSERT INTO registrations (user_id, event_id)
     VALUES ($1, $2)`,
    [userId, eventId]
  );
};

const checkDuplicateRegistration = async (eventId, userId) => {
  const result = await db.query(
    `SELECT 1 FROM registrations WHERE user_id = $1 AND event_id = $2`,
    [userId, eventId]
  );
  return result.rowCount > 0;
};

const checkEventCapacity = async (eventId) => {
  const result = await db.query(
    `SELECT capacity - COUNT(r.user_id) AS remaining
     FROM events e
     LEFT JOIN registrations r ON e.id = r.event_id
     WHERE e.id = $1
     GROUP BY e.capacity`,
    [eventId]
  );
  return result.rows[0]?.remaining;
};

const isPastEvent = async (eventId) => {
  const result = await db.query(
    `SELECT 1 FROM events WHERE id = $1 AND date_time < NOW()`,
    [eventId]
  );
  return result.rowCount > 0;
};

const cancelUserRegistration = async (eventId, userId) => {
  const result = await db.query(
    `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *`,
    [userId, eventId]
  );
  return result.rowCount > 0;
};

const getUpcomingEvents = async () => {
  const result = await db.query(
    `SELECT * FROM events WHERE date_time > NOW()
     ORDER BY date_time ASC, location ASC`
  );
  return result.rows;
};

const getEventStats = async (eventId) => {
  const result = await db.query(
    `SELECT 
      (SELECT COUNT(*) FROM registrations WHERE event_id = $1) AS total_registrations,
      (SELECT capacity FROM events WHERE id = $1) - 
      (SELECT COUNT(*) FROM registrations WHERE event_id = $1) AS remaining_capacity,
      ROUND(
        (SELECT COUNT(*) * 100.0 / capacity FROM events e 
         LEFT JOIN registrations r ON e.id = r.event_id 
         WHERE e.id = $1
         GROUP BY e.capacity), 2
      ) AS percent_used`,
    [eventId]
  );
  return result.rows[0];
};

module.exports = {
  createEvent,
  getEventById,
  registerUserForEvent,
  checkDuplicateRegistration,
  checkEventCapacity,
  isPastEvent,
  cancelUserRegistration,
  getUpcomingEvents,
  getEventStats
};