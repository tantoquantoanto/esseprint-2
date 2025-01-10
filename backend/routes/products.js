const express = require('express');
const cloudStorage = require('../middlewares/multer/cloudinary');
const products = express.Router();
const ProductsModel = require("../models/ProductsSchema")
const multer = require("multer");

const cloud = multer({ storage: cloudStorage});

products.post('/products/upload', cloud.single('img'), async (req,res, next) => {
    try {
        res.status(200).json({img: req.file.path})
        
    } catch (error) {
        next(error);
        
    }

});



products.get('/products', async (req, res, next) => {
    const { page = 1, pageSize = 6, name = "" } = req.query;
    
    try {
      const totalProducts = await ProductsModel.countDocuments({
        name: { $regex: name, $options: 'i' },  
      });
  
      const totalPages = Math.ceil(totalProducts / pageSize);
      const products = await ProductsModel.find({
        name: { $regex: name, $options: 'i' }, 
      })
        .limit(pageSize)
        .skip((page - 1) * pageSize);
  
      if (products.length === 0) {
        return res.status(404).send({ 
          statusCode: 404, 
          message: "Sorry, we didn't find any product" 
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        message: `We have successfully found ${products.length} products`,
        totalProducts: totalProducts,
        totalPages: totalPages,
        products,
      });
  
    } catch (error) {
      next(error);
    }
  });
  





products.get("/products/:productId", async (req,res,next) => {
    const {productId} = req.params; 
    try {
        const product = await ProductsModel.findById(productId)
        
        if (!product) {
              return res.status(404).send({
              statusCode: 404,
              message: "No products found with the given id",
            });}
        res.status(200).send({statusCode: 200, message: "Product found successfully", product})      
      
    } catch (error) {
        next(error)
    }
} )


products.post("/products/create", async(req, res, next) => {
    try {
        const {name, description, basePrice, img, category} = req.body;
        const newProduct = new ProductsModel({
            name,
            description, 
            basePrice, 
            img, 
            category
        })

        const savedProduct = await newProduct.save();
        res.status(201).send({statusCode: 201, message: "Product created successfully", savedProduct})
        
    } catch (error) {
        next(error)
    }
});

products.patch("/products/update/:productId", async (req,res, next) => {
    const {productId} = req.params;
    try {
        const updatedData = req.body;
        const options = {new : true};

        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            productId, 
            updatedData, 
            options
        );

        if(!updatedProduct) {
            return res.status(404).send({statusCode: 404, message: "Product not found"})
        }

        res.status(200).send({
            statusCode: 200,
            message: "Product updated successfully",
            product: updatedProduct
        })
        
    } catch (error) {
        next(error)
    }
});

products.delete("/products/delete/:productId", async (req, res, next) => {
  const { productId } = req.params;

  try {
    console.log(`Deleting product with ID: ${productId}`);  

    const product = await ProductsModel.findByIdAndDelete(productId);
    
    if (!product) {
      console.log("Product not found");  
      return res.status(404).send({
        statusCode: 404,
        message: "Product not found",
      });
    }

    console.log("Product deleted successfully"); 
    res.status(200).send({
      statusCode: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);  
  }
});





module.exports = products; 