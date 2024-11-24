// models/itemModel.js
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    pricingType: { type: String, enum: ['fixed', 'auction', 'donation'], required: true },
    price: { type: Number, required: function () { return this.pricingType !== 'donation'; } },
    photo: { type: String },
    bids: [bidSchema], // Array of bids
    highestBid: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
