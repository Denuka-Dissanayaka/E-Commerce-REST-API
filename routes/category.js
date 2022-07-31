const express = require("express");
const route = express.Router();

const Category = require("../model/category");



// get all category
route.get("/", async (req, res) => {
    try {
      const categoryList = await Category.find();
      if(!categoryList) {
        return res.status(500).json({success: false});
      }
      res.status(200).json(categoryList);
    } catch (err) {
      res.status(500).json({
          error: err.message,
          success: false 
      })
    }
  });

// get one category
route.get("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);
    if(!category) {
      return res.status(404).json('category not found');
    }
    return res.status(200).json(category);
  } catch (err) {
    res.status(500).json({
        error: err.message,
        success: false 
    })
  }
});

// post category
route.post("/", async (req, res) => {
    try {
      const {name, icon, color} = req.body;
      const newCategory = new Category({
        name,
        icon,
        color
      });

      const category = await newCategory.save();
      if(!category) {
        return res.status(404).json('The category cannot be created...!');
      }
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({
          error: err.message,
          success: false 
      })
    }
  });

// update category
route.put("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const {name, icon, color} = req.body;
    const category = await Category.findByIdAndUpdate(categoryId, {
      name,
      icon,
      color
    },{
      new: true
    });

    if(category) {
      return res.status(200).json({success: true, message: 'The category is updated...', data: category});
    } else {
      return res.status(404).json({success: false, message: 'Category not found...'});
    }
  } catch (err) {
    res.status(400).json({
        error: err.message,
        success: false 
    })
  }
});


// delete category
route.delete("/:categoryId", async (req, res) => {
    try {
      const {categoryId} = req.params;
      const category = await Category.findByIdAndRemove(categoryId);

      if(category) {
        return res.status(200).json({success: true, message: 'The category is deleted...'});
      } else {
        return res.status(404).json({success: false, message: 'Category not found...'});
      }
    } catch (err) {
      res.status(400).json({
          error: err.message,
          success: false 
      })
    }
  });



module.exports = route;
