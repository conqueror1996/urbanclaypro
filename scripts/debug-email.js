require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('--- Debug Email Config ---');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '******' : 'MISSING');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('--------------------------');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Verify Error:', error);
    } else {
        console.log('✅ Server is ready to take our messages');

        // Try sending
        transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Debug Test',
            text: 'It works!'
        }, (err, info) => {
            if (err) console.error('❌ Send Error:', err);
            else console.log('✅ Email Sent:', info.response);
        });
    }
});
