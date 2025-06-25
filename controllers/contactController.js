const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
    }
});

exports.submitContactForm = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        // Валидация на входните данни
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ error: 'Моля попълнете всички задължителни полета' });
        }

        const fullName = `${firstName} ${lastName}`;

        // Изпращане на имейл до администратора
        await transporter.sendMail({
            from: `"Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `Ново съобщение от контактната форма: ${subject || 'Без тема'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Ново съобщение от контактната форма</h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
                        <p><strong>Име:</strong> ${fullName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Телефон:</strong> ${phone || 'Не е посочен'}</p>
                        <p><strong>Тема:</strong> ${subject || 'Не е посочена'}</p>
                        <p><strong>Съобщение:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `
        });

        // Изпращане на потвърждение до клиента
        await transporter.sendMail({
            from: `"Rent a Car" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Благодарим за вашето съобщение',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Получихме вашето съобщение</h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
                        <p>Здравейте ${fullName},</p>
                        <p>Благодарим ви, че се свързахте с нас. Това е автоматично потвърждение, че получихме вашето съобщение.</p>
                        <p>Ще се свържем с вас възможно най-скоро.</p>
                        <br>
                        <p><strong>Вашето съобщение:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                        <br>
                        <p>С уважение,<br>Екипът на Rent a Car</p>
                    </div>
                </div>
            `
        });

        res.status(200).json({ message: 'Съобщението беше изпратено успешно' });
    } catch (error) {
        console.error('Error sending contact form:', error);
        res.status(500).json({ error: 'Възникна грешка при изпращането на съобщението' });
    }
}; 