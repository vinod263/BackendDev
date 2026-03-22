import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
})

transporter.verify()
    .then(() => {console.log("Email transporter is ready");})
    .catch((err) => {console.error("Error setting up email transporter:", err);});

export const sendEmail = async ({to, subject, html, text=""}) =>{

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html
    }

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
    return "Email sent successfully To " + to;
}