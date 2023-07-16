const nodemailer = require("nodemailer");

async function sendMail (address, code) {
    const transporter =  nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "adilrar156@gmail.com",
            pass: "yuyfhjkbxvbdmpzs"
        }
    })
    const mailOptions = {
        from: "adilrar156@gmail.com",
        to: address,
        subject: "Email Verification!",
        text: `Your Verification code is ${code}`
    }
    await transporter.sendMail(mailOptions, (err)=> {
        if(err) return console.error("ERROR : ", err)
        return;
    })
}

module.exports = sendMail;