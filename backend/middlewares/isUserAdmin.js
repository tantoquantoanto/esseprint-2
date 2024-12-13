
const isUserAdmin = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({ statusCode: 403, message: "Access denied, admin only" });
    }
    next();
};

module.exports = isUserAdmin;