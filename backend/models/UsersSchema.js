const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsersModel = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true
        },
        surname : {
            type: String, 
            required: true
        },
        email: {
            type : String,
            required: true 

        },
        password: {
            type: String, 
            required: true, 
            minLength: 8
        },
        role: {
            type: String,  
            enum: ['user', 'admin'],
            default: 'user'
        },
        img: {
            type:String, 
            required: false

        },
        orders: [{
            type : mongoose.Schema.Types.ObjectId, ref: 'Order',

        }]


    },
    { timestamps: true, strict: true }
)

UsersModel.pre('save', async function (next) {
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
        
    } catch (error) {
        next(error)
    }
})

module.exports = mongoose.model('User', UsersModel, 'users')