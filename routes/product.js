const express = require("express");
const route = express.Router();

const Product = require("../model/product");
const Category = require('../model/category');

// post product
route.post("/", async (req, res) => {
  try {
    const { name, description, richDescription, image, images, brand, price, category, countInStock, numReviews, rating, isFeatured, dateCreated } = req.body;
    const checkCategory = await Category.findById(category);
    if(!checkCategory) return res.status(400).json({message: 'invalid category'});

    const newProduct = new Product({
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      numReviews,
      rating,
      isFeatured,
      dateCreated
    });
    const product = await newProduct.save();
    if(!product) {
      return res.status(500).json({
        success: false,
        message: 'The product cannot be created...' 
      })
    }
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({
        error: err.message,
        success: false 
    })
  }
});

// get all products
route.get("/", async (req, res) => {
    try {
      let filter = {};

      // get products with queries
      // localhost:3000/api/v1/products?categories=12334556der4,23ngh5467j43
      
      if(req.query.categories) {
        filter = {category: req.query.categories.split(',')};
      }

      const productList = await Product.find(filter).populate('category');
      res.status(200).json(productList);
    } catch (err) {
      res.status(500).json({
          error: err.message,
          success: false 
      })
    }
  });

// get one product
route.get("/:productId", async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Product.findById(productId).populate('category'); 
    if(!product) {
      return res.status(500).json({success: false, message: 'product not found'});
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
        error: err.message,
        success: false 
    })
  }
});

// update product
route.put("/:productId", async (req, res) => {
  try {
    const {productId} = req.params;
    const { name, description, richDescription, image, images, brand, price, category, countInStock, numReviews, rating, isFeatured, dateCreated } = req.body;

    const checkCategory = await Category.findById(category);
    if(!checkCategory) return res.status(400).json({message: 'invalid category'});

    const product = await Category.findByIdAndUpdate(productId, {
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      numReviews,
      rating,
      isFeatured,
      dateCreated
    },{
      new: true
    });

    if(product) {
      return res.status(200).json({success: true, message: 'The product is updated...', data: product});
    } else {
      return res.status(404).json({success: false, message: 'Product not found...'});
    }
  } catch (err) {
    res.status(500).json({
        error: err.message,
        success: false 
    })
  }
});

// delete product
route.delete("/:productId", async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Product.findByIdAndRemove(productId);

    if(product) {
      return res.status(200).json({success: true, message: 'The product is deleted...'});
    } else {
      return res.status(404).json({success: false, message: 'Product not found...'});
    }
  } catch (err) {
    res.status(400).json({
        error: err.message,
        success: false 
    })
  }
});

// count products
route.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments((count) => count);
    res.status(200).json({productCount});
  } catch (err) {
    res.status(500).json({
        error: err.message,
        success: false 
    })
  }
});

// get featured products
route.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(+count);
    if(!products) {
      return res.status(404).json('There is no featured products..');
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
        error: err.message,
        success: false 
    })
  }
});

module.exports = route;
