const mongoose = require("mongoose");
require("dotenv").config();

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database successfully connected')

    
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
};

module.exports = init; 
