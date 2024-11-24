// routes/biddingRoutes.js
const express = require('express');
const router = express.Router();
const biddingController = require('../controller/bid.ctrl');

// Place a bid on an item
router.post('/:itemId/bid', biddingController.placeBid);

// Get all bids for an item
router.get('/:itemId/bids', biddingController.getBids);

module.exports = router;
