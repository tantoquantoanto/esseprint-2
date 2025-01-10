const jwt = require("jsonwebtoken");

const isUserAuthorizedToProfile = (req, res, next) => {
    console.log("Authorization middleware triggered");
    const authorizationHeader = req.header("Authorization");
    const token = authorizationHeader && authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(403).send({ statusCode: 403, message: "Sorry, you are unauthorized" });
    }

    console.log("Token received:", token);  

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decodedToken);  
        const userId = decodedToken.userId;
        console.log("User ID from token:", userId);

        console.log("User ID from request:", req.params.userId);

        if (userId !== req.params.userId) {
            return res.status(403).send({ statusCode: 403, message: "You cannot access this profile" });
        }

        next();
    } catch (error) {
        console.error("Error decoding token:", error);  
        return res.status(403).send({ statusCode: 403, message: "Invalid or expired token" });
    }
};

module.exports = isUserAuthorizedToProfile;
