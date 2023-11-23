const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const authentication = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.send({
            msg: 'Please login first as user'
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.send("Please login");
        }
        
        console.log("Decoded token:", decoded); 
        const user_id = decoded.user_id;
        const user = await UserModel.findOne({ _id: user_id });
        
        if (!user) {
            console.log("User not found in the database"); 
            return res.send("User not found");
        }

        req.user_id = user._id; 
        req.user = user;

        next();
    });
};

module.exports = { authentication };

