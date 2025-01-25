const SENDGRID_API_KEY = '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'; // Replace with your actual API key
const SENDGRID_ENDPOINT = 'https://api.sendgrid.com/v3/mail/send';

async function sendEmail(formData) {
    const emailData = {
        personalizations: [{
            to: [{ email: 'princeiliya@gmail.com' }],
            subject: 'New Contact Form Submission'
        }],
        from: { email: 'contact@djukvakt.se', name: 'Pet Care Services' },
        content: [{
            type: 'text/plain',
            value: `
Name: ${formData.name}
Email: ${formData.email}
Message: ${formData.message}
            `
        }],
        reply_to: { email: formData.email, name: formData.name }
    };

    try {
        const response = await fetch(SENDGRID_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
} 