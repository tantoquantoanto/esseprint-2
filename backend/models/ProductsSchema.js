const mongoose = require('mongoose');
const customizations = require('../routes/customizations');


const ProductsModel = new mongoose.Schema({

    name: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    basePrice : {
        type: Number, 
        required: true
    },
    
    img: {
        type: String
    },
    category: {
        type: String
    },

    options: [
        {
          name: { type: String }, 
          values: [String] 
        }
      ]


})


module.exports = mongoose.model('Product', ProductsModel, 'products');