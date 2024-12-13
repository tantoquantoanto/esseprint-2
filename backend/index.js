const express = require('express');
const PORT = 5052;
const init = require('./utilities/mongoose');
require('dotenv').config();
const cors = require('cors');


require("dotenv").config();
const server = express();
init();

server.use(express.json());
server.use(cors());

const loginRoutes = require("./routes/login");
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const customizationsRoutes = require("./routes/customizations");



const badRequestHandler = require("./middlewares/badRequestHandler");
const unauthorizedHandler = require("./middlewares/unauthorizedHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");
const genericErrorHandler = require("./middlewares/genericErrorHandler")

server.use("/", loginRoutes);
server.use("/", usersRoutes);
server.use("/", productsRoutes)
server.use("/", customizationsRoutes)



server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);






server.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
