const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

console.log('🔥 SERVER FILE LOADED 🔥');
console.log('ENV USER:', process.env.EMAIL_USER);
console.log('ENV PASS:', process.env.EMAIL_PASS ? 'LOADED ✅' : 'NOT LOADED ❌');

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000', 'http://172.28.190.197:3000'], // Add your frontend URL
    credentials: true
}));
app.use(express.json());

// test route
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running...' });
});

// email route
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS  // Use App Password, not regular password
            }
        });

        // Verify transporter connection
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email, // So you can reply directly to the person
            subject: `New Message: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Message</h2>
                    <hr>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                        ${message}
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);

        res.json({
            success: true,
            message: 'Email sent successfully ✅'
        });

    } catch (error) {
        console.error('❌ EMAIL ERROR:', error.message);
        console.error('❌ FULL ERROR:', error); // Log full error

        if (error.message.includes('Invalid login')) {
            return res.status(500).json({
                success: false,
                message: 'Email credentials invalid. Check EMAIL_USER and EMAIL_PASS in .env'
            });
        }

        res.status(500).json({
            success: false,
            message: `Failed to send email: ${error.message}` // Show actual error to frontend
        });
    }
});

// 404 route
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});