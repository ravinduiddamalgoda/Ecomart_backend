if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const transporter = require("../configs/email.config");

const send = async (receivers, subject, html, text) => {
    try {
        const info = await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: receivers.join(', '),
          subject: subject, 
          text: text, 
          html: html,
        });

        return info;
    }catch(error){
        console.log(error);
    }
}

module.exports = {send};