const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Transporter yarat
    // Gmail üçün port 587 ve secure: false istifadə edin (TLS üçün)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Gmail üçün daha asan konfiqurasiya
        auth: {
            user: process.env.SMTP_EMAIL, 
            pass: process.env.SMTP_PASSWORD 
        }
    });

    // 2) Email mesajını hazırla
    const message = {
        from: `Booking App <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // 3) Email-i göndər
    await transporter.sendMail(message);
};

module.exports = sendEmail;
