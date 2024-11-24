// controllers/itemController.js
const itemService = require('../services/item.service');

const createItem = async (req, res) => {
  try {
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Save the uploaded file path
    const itemData = req.body;

    const item = await itemService.createItem(itemData, photoPath);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await itemService.getItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
};
