export const paymentTranslations = {
  bg: {
    pleaseWait: "Моля, изчакайте...",
    confirmingPayment: "Потвърждаване на плащането",
    paymentFailed: "Плащането не е успешно",
    paymentSuccessful: "Плащането е успешно",
    paymentConfirmationFailed: "Възникна проблем при потвърждаване на плащането",
    bookingConfirmationSent: "Изпратихме потвърждение за резервацията на вашия имейл",
    thankYouForBooking: "Благодарим ви, че избрахте нашите услуги",
    redirectingHome: "Ще бъдете пренасочени към началната страница след {seconds} секунди",
    whatHappensNext: "Какво следва",
    checkEmailStep: "Проверете имейла си за потвърждение на резервацията",
    contactSupportIfProblemPersists: "Ако проблемът продължава, моля свържете се с нас"
  },
  en: {
    pleaseWait: "Please wait...",
    confirmingPayment: "Confirming payment",
    paymentFailed: "Payment failed",
    paymentSuccessful: "Payment successful",
    paymentConfirmationFailed: "There was a problem confirming your payment",
    bookingConfirmationSent: "We've sent a booking confirmation to your email",
    thankYouForBooking: "Thank you for choosing our services",
    redirectingHome: "You will be redirected to the homepage in {seconds} seconds",
    whatHappensNext: "What happens next",
    checkEmailStep: "Check your email for booking confirmation",
    contactSupportIfProblemPersists: "If the problem persists, please contact us"
  }
} as const;

export type PaymentTranslationKey = keyof typeof paymentTranslations.en; 