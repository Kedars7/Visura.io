const express = require('express');
const { getRuns } = require('../controllers/inngestController.js');
const router = express.Router();

router.get('/events/:eventId/runs', getRuns);

module.exports = router;
