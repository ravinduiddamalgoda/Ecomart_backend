// controllers/biddingController.js
const biddingService = require('../services/bid.service');

const placeBid = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId, bidAmount } = req.body;

    if (!userId || !bidAmount) {
      return res.status(400).json({ error: 'User ID and bid amount are required' });
    }

    const updatedItem = await biddingService.placeBid(itemId, userId, bidAmount);
    console.log(updatedItem);
    res.send(updatedItem).status(200);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBids = async (req, res) => {
  try {
    const { itemId } = req.params;

    const bids = await biddingService.getBids(itemId);
    res.status(200).json(bids);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { placeBid, getBids };
