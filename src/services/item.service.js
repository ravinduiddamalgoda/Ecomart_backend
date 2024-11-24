// services/itemService.js
const Item = require('../models/Item');

const createItem = async (itemData, photoPath) => {
  try {
    const newItem = new Item({
      ...itemData,
      photo: photoPath, // Store the photo path in the database
    });
    return await newItem.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getItems = async () => {
  try {
    return await Item.find({});
  } catch (error) {
    throw new Error(error.message);
  }
};

const getItemById = async (id) => {
  try {
    return await Item.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteItemById = async (id) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(id);
      if (!deletedItem) {
        throw new Error('Item not found');
      }
      return deletedItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }


module.exports = {
  createItem,
  getItems,
  getItemById,
};
