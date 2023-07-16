const User = require("../model/user");
const sendMail = require("../mail/mail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let verificationCode;
const registerUser =  async (req, res)=> {
    try {
        verificationCode = Math.floor(Math.random() * 43597);
        const { firstName, lastName, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        sendMail(email, verificationCode);
        res.status(200).json({firstName, lastName, email, password: hashedPassword, tokens: []});
    } catch (err) {
        res.status(400).json({msg: "please try again!"})
    }
}
const validRegister = async (req, res)=> {
    try {
        const { user } = req.body;
        if(!user) return res.status(400).json({msg: "Invalid verification code!"});
        const saveUser = await User.create({...user});
        res.status(201).json({user : saveUser});
    } catch (err) {
        res.status(400).json({msg: "try again!"});
    }
}
const loginUser = async (req, res)=> {
    try {
        let thisDay = Date.now();
        const dateInDays = (((thisDay/1000 )/60 )/60 )/24;
        const expirationDate = dateInDays + 30;
        
        const { email } = req.body;
        const user = await User.findOne({email});
        if(req.isValidPassword === false) return res.status(401).json({msg: "invalid form!"});
        const accessToken = jwt.sign({email, id: user._id}, process.env.ACCESS_SECRET_TOKEN, {expiresIn: "30d"});
        await User.findOneAndUpdate({email: user.email}, {tokens: [...user.tokens, {token:accessToken, expiresAt: expirationDate}]});
        res.status(201).json({user, token: accessToken});
    } catch (err) {
        console.log(err);
    }
}
const dashboard = async (req, res)=> {
    try {
        const {firstName, lastName, email, _id} = await User.findOne({_id: req.user.id});
        res.status(201).json({fullName: firstName + " " + lastName, email, id: _id});
    } catch (err) {
        console.error("ERROR : ",err);
    }
}
const getUser = async (req, res)=> {
    try {
        const user = await User.findOne({_id: req.params.id});
        res.status(200).json({tokens: user.tokens});
    } catch (err) {
        res.status(400).json({msg: "please try again!"});
    }
};
const logoutUser = async (req, res)=> {
    try {
        await User.findByIdAndUpdate({_id: req.params.id}, {tokens: [...req.body.tokens]});
        res.status(200).json({msg: "updated successfully!"});
    } catch (err) {
        res.status(400).json({msg: "please try again!"});
    }
};
const removeExpiredToken = async (req, res)=> {
    try {
        const { tokens } = await User.findOne({_id: req.params.id});
        const currentDateInDays = Date.now() / 1000 / 60 / 60 / 24;
        const filterTokens = tokens.filter(({expiresAt})=> +expiresAt > currentDateInDays);
        await User.findOneAndUpdate({_id: req.params.id}, {tokens: [...filterTokens]});
        res.status(200).json({msg: "updated successfully"});
    } catch (err) {
        res.status(400).json({msg: "please try again!"});
    }
};
const searchUserByEmail  = async (req, res)=> {
    verificationCode = Math.floor(Math.random() * 43597);
    try {
        const user = await User.findOne({email: req.params.email});
        if(!user) return res.status(400).json({msg: "email not found!"});
        sendMail(user.email, verificationCode);
        res.status(200).json({id: user._id});
    } catch (err) {
        res.status(400).json({msg: "please try again!"})
    }
}
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if(!password) return res.status(400).json({msg: "please enter valid password!"});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.findOneAndUpdate({_id: id}, {password: hashedPassword});
        res.status(201).json({msg: "password reseted!"});
    } catch (err) {
        res.status(400).json({msg: "please try again!"});
    }
}
const getVerificationCode = async (req, res)=> {
    try {
        res.status(201).json({code: verificationCode});
    } catch (err) {
        res.status(400).json({msg: "please try again!"})
    }
}
module.exports = {
    registerUser,
    validRegister,
    getVerificationCode,
    loginUser,
    dashboard,
    getUser,
    logoutUser,
    removeExpiredToken,
    resetPassword,
    searchUserByEmail
};