const express = require("express");
const users = express.Router();
const UsersModel = require("../models/UsersSchema");
const isUserAuthorizedToProfile = require("../middlewares/isUserAuthorizedToProfile");
const sendConfirmationEmail = require("../middlewares/sendConfirmationEmail");
const multer = require("multer");
const cloudStorage = require("../middlewares/multer/cloudinary");

const cloud = multer({storage: cloudStorage})


users.post("/users/upload"), cloud.single('img'), async (req,res) => {
try {
  res.status(200).json({img: req.file.path})
  
} catch (error) {
  next(error)
  
}

}


users.get("/users", async (req,res, next) => {
  try {
    const users = await UsersModel.find();
    if(users.length === 0) {
      return res.status(404).send({statusCode: 404, message: "Sorry, we didn't find any user"})
    }

    res.status(200).send({statusCode: 200, message: `We found ${users.length} users`, users})
    
  } catch (error) {
    next(error)
  }
})


users.post("/register", async (req, res) => {
  const { name, surname, email, password, role } = req.body;

  try {
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        statusCode: 400,
        message: "Questo indirizzo email è già registrato",
      });
    }
    const newUser = new UsersModel({
      name,
      surname,
      email,
      password,
      role,
    });
    const savedUser =  await newUser.save();
    await sendConfirmationEmail({ email: savedUser.email, name: savedUser.name });
    res.status(201).send({
      statusCode: 201,
      message: "Utente registrato con successo",
      savedUser
    });
  } catch (error) {
    console.error(error);  
    res.status(500).send({
      statusCode: 500,
      message: "Errore nel salvataggio dell'utente",
      error: error.message,
    });
}
});


users.get("/users/:userId", isUserAuthorizedToProfile, async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await UsersModel.findById(userId)
      .populate({path: "products", select: "name"})
      .populate({path: "orders"});
      if (!user) {
        return res
          .status(404)
          .send({ statusCode: 404, message: "No user found with the given id" });
      }
  
      res
        .status(200)
        .send({ statusCode: 200, message: "User found successfully", user });
    } catch (error) {
      next(error);
    }
  });
  

  users.patch("/users/update/:userId",  async (req, res, next) => {
    const { userId } = req.params;
    try {
      const updatedData = req.body;
      const options = { new: true };
  
      const result = await UsersModel.findByIdAndUpdate(
        userId,
        updatedData,
        options
      );
      if (!result) {
        return res
          .status(404)
          .send({ statusCode: 404, message: "User not found" });
      }
  
      res
        .status(200)
        .send({
          statusCode: 200,
          message: "User updated successfully",
          user: result
        });
    } catch (error) {
      next(error);
    }
  });


  users.delete("/users/delete/:userId", isUserAuthorizedToProfile, async (req, res, next) => {
    const { userId } = req.params;
    try {
      const deletedUser = await UsersModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res
          .status(404)
          .send({ statusCode: 404, message: "User not found" });
      }
  
      res
        .status(200)
        .send({ statusCode: 200, message: "User deleted successfully", userId });
    } catch (error) {
      next(error);
    }
  });
  
  










module.exports = users;
