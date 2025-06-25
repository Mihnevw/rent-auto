const nodemailer = require('nodemailer');

// Създаваме транспортер за nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Функция за изпращане на имейл за потвърждение на резервация
async function sendReservationConfirmation(reservation) {
    const populated = await reservation.populate('carId fromPlace toPlace');

    const mailOptions = {
        from: `"Rent a Car" <${process.env.SMTP_USER}>`,
        to: reservation.email,
        subject: 'Благодарим за резервацията!',
        html: `
        <center>
        <div style="max-width: 500px; width: 100%; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px; color: white; font-weight: bold; line-height: 60px;">✓</div>
                <h1 style="color: white; font-size: 24px; font-weight: 600; margin: 0 0 10px 0; padding: 0;">Успешна Резервация!</h1>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; padding: 0;">Вашата резервация е потвърдена</p>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
                <div style="font-size: 18px; color: #333333; margin-bottom: 30px; line-height: 1.6;">
                    Благодарим за резервацията!<br>
                    Вашият код е:
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 25px; margin: 30px 0; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
                    <div style="color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 500; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Код за Резервация</div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: bold; color: white; letter-spacing: 3px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">${reservation.code}</div>
                </div>
                <div style="margin: 30px 0 10px 0; text-align: left;">
                    <b>Детайли за резервацията:</b><br>
                    Име: ${reservation.customerName}<br>
                    Телефон: ${reservation.phone}<br>
                    Email: ${reservation.email}<br>
                    Дата и час на взимане: ${reservation.fromDate} ${reservation.fromTime}<br>
                    Място на взимане: ${populated.fromPlace.name}, ${populated.fromPlace.address}<br>
                    Дата и час на връщане: ${reservation.toDate} ${reservation.toTime}<br>
                    Място на връщане: ${populated.toPlace.name}, ${populated.toPlace.address}<br>
                    <br>
                    <b>Автомобил:</b><br>
                    Марка: ${populated.carId.make}<br>
                    Модел: ${populated.carId.model}<br>
                    Двигател: ${populated.carId.engine}<br>
                    Гориво: ${populated.carId.fuel}<br>
                    Година: ${populated.carId.year}<br>
                    Скоростна кутия: ${populated.carId.transmission}<br>
                </div>
                <div style="background-color: rgba(102, 126, 234, 0.1); color: #667eea; padding: 15px; border-radius: 10px; font-size: 14px; margin-top: 20px; border: 1px dashed #667eea;">
                    💡 Запазете този код - ще ви е необходим при идване
                </div>
            </div>
            <div style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
                    Благодарим ви, че избрахте нашите услуги!<br>
                    При въпроси, моля свържете се с нас.
                </p>
            </div>
        </div>
        </center>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reservation confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending reservation confirmation email:', error);
        throw new Error('Failed to send confirmation email');
    }
}

// Функция за изпращане на имейл за потвърждение на плащане
async function sendPaymentConfirmation(reservation) {
    const populated = await reservation.populate('carId');

    const mailOptions = {
        from: `"Rent a Car" <${process.env.SMTP_USER}>`,
        to: reservation.email,
        subject: 'Потвърждение за плащане',
        html: `
        <center>
        <div style="max-width: 500px; width: 100%; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px; color: white; font-weight: bold; line-height: 60px;">💳</div>
                <h1 style="color: white; font-size: 24px; font-weight: 600; margin: 0 0 10px 0; padding: 0;">Успешно Плащане!</h1>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; padding: 0;">Вашето плащане е обработено успешно</p>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
                <div style="font-size: 18px; color: #333333; margin-bottom: 30px; line-height: 1.6;">
                    Получихме вашето плащане на стойност:<br>
                    <strong style="font-size: 24px; color: #667eea;">${reservation.totalAmount} BGN</strong>
                </div>
                <div style="margin: 30px 0 10px 0; text-align: left;">
                    <b>Детайли за плащането:</b><br>
                    Име: ${reservation.customerName}<br>
                    Резервация №: ${reservation._id}<br>
                    Автомобил: ${populated.carId.make} ${populated.carId.model}<br>
                    Дата на плащане: ${new Date().toLocaleDateString('bg-BG')}
                </div>
            </div>
            <div style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
                    Това е автоматично генериран имейл.<br>
                    Моля, запазете го за вашата документация.
                </p>
            </div>
        </div>
        </center>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Payment confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
        throw new Error('Failed to send payment confirmation email');
    }
}

module.exports = {
    sendReservationConfirmation,
    sendPaymentConfirmation
}; 