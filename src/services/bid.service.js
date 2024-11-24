// services/biddingService.js
const Item = require('../models/Item');

const placeBid = async (itemId, userId, bidAmount) => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error('Item not found');
  }

  if (item.pricingType !== 'auction') {
    throw new Error('Bidding is only allowed on auction items');
  }

  if (bidAmount <= item.highestBid.amount) {
    throw new Error('Bid amount must be higher than the current highest bid');
  }

  // Add the bid to the item's bid list
  item.bids.push({ userId, amount: bidAmount });

  // Update the highest bid
  item.highestBid = { userId, amount: bidAmount };

  await item.save();
  return item;
};

const getBids = async (itemId) => {
  const item = await Item.findById(itemId).populate('bids.userId', 'name email');

  if (!item) {
    throw new Error('Item not found');
  }

  return item.bids;
};

module.exports = { placeBid, getBids };
