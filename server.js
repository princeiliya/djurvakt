const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const msg = {
            to: 'princeiliya@gmail.com',
            from: 'contact@djukvakt.se',
            subject: 'New Contact Form Submission',
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
            `,
            replyTo: email
        };

        await sgMail.send(msg);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 