const eventModel = require('../models/eventModel');

exports.createEvent = async (req, res, next) => {
  try {
    const { title, date_time, location, capacity } = req.body;
    if (!title || !date_time || !location || !capacity)
      return res.status(400).json({ error: 'Missing required fields.' });

    if (capacity <= 0 || capacity > 1000)
      return res.status(400).json({ error: 'Capacity must be between 1 and 1000.' });

    const event = await eventModel.createEvent({ title, date_time, location, capacity });
    res.status(201).json({ id: event.id });
  } catch (err) {
    next(err);
  }
};

exports.getEventDetails = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await eventModel.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.registrations.length === 1 && event.registrations[0].id === null) {
      event.registrations = [];
    }

    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: 'User ID is required' });

    const event = await eventModel.getEventById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const isPast = await eventModel.isPastEvent(eventId);
    if (isPast) return res.status(400).json({ error: 'Cannot register for past events' });

    const duplicate = await eventModel.checkDuplicateRegistration(eventId, user_id);
    if (duplicate) return res.status(400).json({ error: 'User already registered' });

    const remaining = await eventModel.checkEventCapacity(eventId);
    if (remaining <= 0) return res.status(400).json({ error: 'Event is full' });

    await eventModel.registerUserForEvent(eventId, user_id);
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: 'User ID is required' });

    const success = await eventModel.cancelUserRegistration(eventId, user_id);
    if (!success) return res.status(400).json({ error: 'User was not registered for this event' });

    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

exports.listUpcomingEvents = async (req, res, next) => {
  try {
    const events = await eventModel.getUpcomingEvents();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEventStats = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const stats = await eventModel.getEventStats(eventId);
    if (!stats) return res.status(404).json({ error: 'Event not found or no registrations yet' });
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};