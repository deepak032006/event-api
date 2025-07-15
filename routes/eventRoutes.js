const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/:id', eventController.getEventDetails);
router.post('/:id/register', eventController.registerUser);
router.delete('/:id/register', eventController.cancelRegistration);
router.get('/', eventController.listUpcomingEvents);
router.get('/:id/stats', eventController.getEventStats);

module.exports = router;