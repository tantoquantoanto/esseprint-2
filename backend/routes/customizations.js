const express = require("express");
const cloudStorage = require("../middlewares/multer/cloudinary");
const CustomizationModel = require("../models/CustomizationSchema")
const customizations = express.Router();
const multer = require("multer");


const cloud = multer({storage: cloudStorage});

customizations.post("/customizations/upload/cloud", cloud.single("img"), async (req,res,next) => {
    try {
        res.status(200).json({img: req.file.path})
        
    } catch (error) {
        next(error)
    }
});


customizations.get("/customizations", async (req,res,next) => {
    try {
        const customizations = await CustomizationModel.find();

        res.status(200).send({statusCode: 200, message: "Customizations found successfully", customizations})
        
    } catch (error) {
        next(error)
    }
})


customizations.post("/customizations/create", async(req, res,next) => {
    try {
        const {product, imageUpload, text, color, quantity, customizationPrice } = req.body;

        const newCustomization = new CustomizationModel({
            product,
            imageUpload,
            text,
            color,
            quantity, 
            customizationPrice
        });
        const savedCustomization = await newCustomization.save();
        res.status(201).send({statusCode: 201, message: "New Customization successfully created", savedCustomization})

        
    } catch (error) {
        next(error)
    }
});


customizations.patch("/customizations/update/:customizationId", async (req,res,next) => {
    try {
        const {customizationId} = req.params;
        const updatedData = req.body;
        const options = {new : true};

        const updatedCustomization = await CustomizationModel.findByIdAndUpdate(
            customizationId,
            updatedData,
            options
        );
        if(!updatedCustomization) {
            return res.status(404).send({statusCode: 404, message: "No customization found"})
        }

        res.status(200).send({statusCode: 200, message: "Customization updated successfully", updatedCustomization})
        
    } catch (error) {
        next(error)
    }
});


module.exports = customizations; 