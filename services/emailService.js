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
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 10px; background-color: #f5f5f5; font-family: Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
            <center>
            <div style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e0e0e0; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
                    <div style="width: 50px; height: 50px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-block; margin: 0 auto 15px; font-size: 24px; color: white; font-weight: bold; line-height: 50px;">✓</div>
                    <h1 style="color: white; font-size: 22px; font-weight: 600; margin: 0 0 8px 0; padding: 0;">Успешна Резервация!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; margin: 0; padding: 0;">Вашата резервация е потвърдена</p>
                </div>
                <div style="padding: 25px 15px;">
                    <div style="text-align: center; font-size: 16px; color: #333333; margin-bottom: 25px; line-height: 1.5;">
                        Благодарим за резервацията!<br>
                        Вашият код е:
                    </div>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 20px 15px; margin: 20px auto; text-align: center; max-width: 280px;">
                        <div style="color: rgba(255, 255, 255, 0.8); font-size: 13px; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Код за Резервация</div>
                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold; color: white; letter-spacing: 2px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); word-break: break-all;">${reservation.code}</div>
                    </div>
                    <div style="width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 auto;">
                        <table style="width: 100%; margin: 20px 0; border-collapse: collapse; min-width: 280px;">
                            <tr>
                                <td colspan="2" style="padding: 10px 5px; border-bottom: 1px solid #eee;"><b style="font-size: 16px;">Детайли за резервацията:</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Име:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${reservation.customerName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Телефон:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${reservation.phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Email:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500; word-break: break-all;">${reservation.email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Дата и час на взимане:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${reservation.fromDate} ${reservation.fromTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Място на взимане:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.fromPlace.name}, ${populated.fromPlace.address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Дата и час на връщане:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${reservation.toDate} ${reservation.toTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Място на връщане:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.toPlace.name}, ${populated.toPlace.address}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding: 15px 5px 8px 5px; border-bottom: 1px solid #eee;"><b style="font-size: 16px;">Автомобил:</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Марка:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.carId.make}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Модел:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.carId.model}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Двигател:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.carId.engine}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Гориво:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.carId.fuel}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Година:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.carId.year}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 5px; width: 40%; color: #666;">Скоростна кутия:</td>
                                <td style="padding: 8px 5px; color: #333; font-weight: 500;">${populated.carId.transmission}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="background-color: rgba(102, 126, 234, 0.1); color: #667eea; padding: 15px; border-radius: 8px; font-size: 14px; margin: 20px auto 0; border: 1px dashed #667eea; text-align: center; max-width: 280px;">
                        💡 Запазете този код - ще ви е необходим при идване
                    </div>
                </div>
                <div style="padding: 20px 15px; background-color: #f8f9fa; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                    <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0; padding: 0;">
                        Благодарим ви, че избрахте нашите услуги!<br>
                        При въпроси, моля свържете се с нас.
                    </p>
                </div>
            </div>
            </center>
        </body>
        </html>
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