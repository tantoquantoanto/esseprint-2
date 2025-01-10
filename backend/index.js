const express = require('express');
const PORT = 5052;
const init = require('./utilities/mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require("path");



require("dotenv").config();
const server = express();
init();

server.use("/uploads", express.static(path.join(__dirname, "./uploads")))
server.use(express.json());
server.use(cors());

const loginRoutes = require("./routes/login");
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const customizationsRoutes = require("./routes/customizations");
const ordersRoutes = require ("./routes/orders");
const googleRoutes = require ("./routes/google");
const emailRoutes = require("./routes/emails");



const badRequestHandler = require("./middlewares/badRequestHandler");
const unauthorizedHandler = require("./middlewares/unauthorizedHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");
const genericErrorHandler = require("./middlewares/genericErrorHandler")

server.use("/", loginRoutes);
server.use("/", usersRoutes);
server.use("/", productsRoutes)
server.use("/", customizationsRoutes)
server.use("/", ordersRoutes);
server.use("/", googleRoutes);
server.use("/", emailRoutes)



server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);






server.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
