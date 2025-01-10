const express = require("express");
const UsersModel = require("../models/UsersSchema");
const ProductsModel = require("../models/ProductsSchema");
const CustomizationModel = require("../models/CustomizationSchema")
const checkUserRole = require("../middlewares/checkUserRole");
const isUserAdmin = require("../middlewares/isUserAdmin");
const OrdersModel = require("../models/OrdersSchema");

const orders = express.Router();

orders.get("/orders", checkUserRole, isUserAdmin, async (req, res, next) => {
  const { page = 1, pageSize = 20 } = req.query;
  try {
    const orders = await OrdersModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .populate({ path: "user", selectç: "name surname email" });

    if (orders.length === 0) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "No orders found" });
    }

    res
      .status(200)
      .send({
        statusCode: 200,
        message: `We found ${orders.length} orders`,
        orders,
      });
  } catch (error) {
    next(error);
  }
});

orders.get("/orders/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await OrdersModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .send({
          statusCode: 404,
          message: "No orders found with the given Id",
        });
    }

    res
      .status(200)
      .send({ statusCode: 200, message: "Order found successfully", order });
  } catch (error) {
    next(error);
  }
});

orders.post("/orders/create", async (req, res, next) => {
  const { user, products, customizations } = req.body;

  try {
  
    const userExists = await UsersModel.findById(user);
    if (!userExists) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }

    const foundProducts = await ProductsModel.find({ _id: { $in: products } });
    if (foundProducts.length !== products.length) {
      return res.status(404).send({
        statusCode: 404,
        message: "One or more products not found",
      });
    }

    
    const totalProductPrice = foundProducts.reduce(
      (total, product) => total + product.basePrice,
      0
    );

   
    let totalCustomizationPrice = 0;
    let validCustomizations = [];
    if (customizations && Array.isArray(customizations) && customizations.length > 0) {
      validCustomizations = await CustomizationModel.find({
        _id: { $in: customizations },
      });

      if (validCustomizations.length !== customizations.length) {
        return res.status(404).send({
          statusCode: 404,
          message: "One or more customizations not found",
        });
      }

     
      totalCustomizationPrice = validCustomizations.reduce(
        (total, customization) => total + customization.customizationPrice,
        0
      );
    }

    
    const newOrder = new OrdersModel({
      user,
      products: foundProducts.map((product) => product._id),
      customizations: validCustomizations.map((custom) => custom._id),
      totalPrice: totalProductPrice + totalCustomizationPrice,
    });


    const savedOrder = await newOrder.save();

    
    res.status(201).send({
      statusCode: 201,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
});orders.post("/orders/create", async (req, res, next) => {
  const { user, products, customizations } = req.body;

  try {
    console.log("Request body:", req.body);  

    const userExists = await UsersModel.findById(user);
    if (!userExists) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }

  
    const foundProducts = await ProductsModel.find({ _id: { $in: products } });
    if (foundProducts.length !== products.length) {
      return res.status(404).send({
        statusCode: 404,
        message: "One or more products not found",
      });
    }

    const totalProductPrice = foundProducts.reduce(
      (total, product) => total + product.basePrice,
      0
    );

    
    let totalCustomizationPrice = 0;
    let validCustomizations = [];

    
    if (customizations && Array.isArray(customizations) && customizations.length > 0) {
      
      validCustomizations = await CustomizationModel.find({
        _id: { $in: customizations },
      });

      
      if (validCustomizations.length !== customizations.length) {
        return res.status(404).send({
          statusCode: 404,
          message: "One or more customizations not found",
        });
      }

      
      totalCustomizationPrice = validCustomizations.reduce(
        (total, customization) => total + customization.customizationPrice,
        0
      );
    } else {
      console.log("Customizations are missing or empty");
      
      validCustomizations = [];
      totalCustomizationPrice = 0;
    }

   
    const newOrder = new OrdersModel({
      user,
      products: foundProducts.map((product) => product._id),
      customizations: validCustomizations.map((custom) => custom._id),
      totalPrice: totalProductPrice + totalCustomizationPrice,
    });

    const savedOrder = await newOrder.save();

    res.status(201).send({
      statusCode: 201,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error); 
    next(error);
  }
});


  

  orders.patch("/orders/:orderId", async (req, res, next) => {
    const { orderId } = req.params;
    const { products, customizations, status } = req.body;
  
    try {
      
      const order = await OrdersModel.findById(orderId);
      if (!order) {
        return res.status(404).send({
          statusCode: 404,
          message: "Order not found",
        });
      }
  
      let totalProductPrice = 0;
      let totalCustomizationPrice = 0;
  
      
      if (products) {
        const validProducts = [];
        for (const productId of products) {
          const product = await ProductsModel.findById(productId);
          if (!product) {
            return res.status(404).send({
              statusCode: 404,
              message: `Product with ID ${productId} not found`,
            });
          }
          validProducts.push(product);
          totalProductPrice += product.basePrice;
        }
        order.products = validProducts.map((product) => product._id);
      }
  
      
      if (customizations) {
        const validCustomizations = [];
        for (const customizationId of customizations) {
          const customization = await CustomizationModel.findById(customizationId);
          if (!customization) {
            return res.status(404).send({
              statusCode: 404,
              message: `Customization with ID ${customizationId} not found`,
            });
          }
          validCustomizations.push(customization);
          totalCustomizationPrice += customization.customizationPrice;
        }
        order.customizations = validCustomizations.map(
          (customization) => customization._id
        );
      }
  
      
      if (status) {
        const validStatuses = ["pending", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
          return res.status(400).send({
            statusCode: 400,
            message: `Invalid status value: ${status}`,
          });
        }
        order.status = status;
      }
  
    
      if (products || customizations) {
        order.totalPrice = totalProductPrice + totalCustomizationPrice;
      }
  
      
      await order.save();
  
      res.status(200).send({
        statusCode: 200,
        message: "Order updated successfully",
        order,
      });
    } catch (error) {
      next(error);
    }
  });
  


module.exports = orders;
