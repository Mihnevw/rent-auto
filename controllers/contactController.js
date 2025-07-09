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
            from: `"AUTO RENT" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Благодарим за вашето съобщение',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background: #22c55e; border-radius: 50%; width: 56px; height: 56px; line-height: 56px;">
                            <span style="font-size: 32px; color: #fff; vertical-align: middle;">&#10003;</span>
                        </div>
                        <h2 style="color: #1e293b; font-size: 2rem; margin: 16px 0 0 0; font-weight: bold;">Благодарим ви за вашето съобщение!</h2>
                    </div>
                    <div style="background-color: #fff; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
                        <p style="font-size: 1.1rem; color: #222; margin-bottom: 12px;">Здравейте, <strong>${fullName}</strong>,</p>
                        <p style="color: #334155; margin-bottom: 12px;">Благодарим ви, че се свързахте с нас. Това е автоматично потвърждение, че получихме вашето съобщение.</p>
                        <p style="color: #334155; margin-bottom: 12px;">Ще се свържем с вас възможно най-скоро.</p>
                        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
                        <p style="color: #1e293b; font-weight: 500; margin-bottom: 6px;">Вашето съобщение:</p>
                        <div style="background: #f1f5f9; border-radius: 6px; padding: 16px; color: #475569; font-size: 1rem; white-space: pre-wrap;">${message}</div>
                    </div>
                    <div style="text-align: right; color: #64748b; font-size: 1rem; margin-top: 16px;">
                        <p>С уважение,<br><span style="font-weight: 500; color: #0ea5e9;">Екипът на AUTORENT</span></p>
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