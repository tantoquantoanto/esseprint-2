const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const login = express.Router();
const UsersModel = require("../models/UsersSchema");

login.post('/login', async (req,res) => {
    const {email, password} = req.body; 
    try {
        const user = await UsersModel.findOne({email});
        if(!user) {
            return res.status(404).send({statusCode: 404, message: 'Sorry, there is no user with the given email'})
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordValid) {
            return res.status(401).send({statusCode: 401, message: 'The password you provided is not valid'})
        }

        const token = jwt.sign({
            role: user.role,
            userId: user._id,
            createdAt: user.createdAt
        }, process.env.JWT_SECRET, {
            expiresIn: '20m'
        });
        console.log("Generated Token:", token);

    
        res
            .header('Authorization', `Bearer ${token}`)
            .status(200)
            .send({
                statusCode: 200,
                message: 'Login successfully',
                token
            })
    } catch (error) {
        next(error)
    }
});


module.exports = login; 




