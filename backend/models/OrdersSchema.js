const mongoose = require('mongoose');


const OrdersModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customization'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
    }],
    totalPrice: {
        type: Number, 
        required: true
    },
    status: {
        type: String, 
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    }

})


module.exports = mongoose.model('Order', OrdersModel, 'orders');