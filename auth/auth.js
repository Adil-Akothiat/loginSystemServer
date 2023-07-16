const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authenticate = async (req, res, next)=> {
    const authHeader = req.headers.authorization || false;
    if (authHeader === false) return res.status(401).json({ msg: "Unauthorized!" })
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ msg: "invalid credentials!" });
        req.user = user;
        next();
    })
}
const validForm = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        req.isValidPassword = isValidPassword;
        next();
    } else {
        res.status(401).json({ msg: "invalid form!" })
    }
}

module.exports = {
    authenticate,
    validForm
}