# AUTO Rent - Car Rental Platform

Съвременна уеб платформа за наемане на автомобили в България, предлагаща премиум автомобили с гъвкави условия за кратък и дългосрочен наем.

## 🚗 Функционалности

### За клиентите
- **Търсене на автомобили** - Филтриране по тип, гориво, скоростна кутия
- **Резервации** - Онлайн резервация с избор на дати и локации
- **Плащания** - Интеграция със Stripe за сигурни онлайн плащания
- **Многоезичност** - Поддръжка на български и английски език
- **Мобилна оптимизация** - Responsive дизайн за всички устройства
- **Доставка** - Доставка на автомобил до избрана локация

### За администраторите
- **Управление на автомобили** - Добавяне, редактиране, изтриване
- **Резервации** - Преглед и управление на всички резервации
- **Потребители** - Управление на клиентски акаунти
- **Локации** - Управление на офиси и точки за наемане

## 🛠 Технологии

### Frontend
- **Next.js 14** - React framework с App Router
- **TypeScript** - Типизиран JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Компонентна библиотека
- **Lucide React** - Икони
- **Date-fns** - Работа с дати

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL база данни
- **Mongoose** - ODM за MongoDB
- **JWT** - Автентикация
- **Stripe** - Плащания
- **Multer** - File uploads

### Други
- **Vercel** - Deployment
- **Git** - Version control

## 📁 Структура на проекта

```
rent-car/
├── app/                    # Next.js App Router
│   ├── about/             # Страница "За нас"
│   ├── admin/             # Админ панел
│   ├── booking/           # Резервации
│   ├── cars/              # Автомобили
│   ├── contacts/          # Контакти
│   └── ...
├── components/            # React компоненти
│   ├── ui/               # UI компоненти
│   ├── sections/         # Секции на страниците
│   └── ...
├── lib/                  # Утилити и конфигурации
│   ├── translations.ts   # Преводи
│   ├── config.ts        # Конфигурация
│   └── ...
├── hooks/                # Custom React hooks
├── public/               # Статични файлове
└── rent a car/          # Backend API
    ├── controllers/      # API контролери
    ├── models/          # MongoDB модели
    ├── routes/          # API routes
    └── ...
```

## 🚀 Инсталация

### Предварителни изисквания
- Node.js 18+ 
- MongoDB
- Stripe акаунт

### Frontend (Next.js)

```bash
# Инсталиране на зависимости
npm install

# Стартиране в development режим
npm run dev

# Build за production
npm run build

# Стартиране на production build
npm start
```

### Backend (Node.js)

```bash
cd "rent a car"

# Инсталиране на зависимости
npm install

# Стартиране на сървъра
npm start

# Development режим с nodemon
npm run dev
```

### Environment Variables

Създайте `.env.local` файл в root директорията:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/auto-rent

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# JWT
JWT_SECRET=your-secret-key

# API
NEXT_PUBLIC_API_URL=http://localhost:8800
```

## 🌐 Deployment

### Frontend (Vercel)
1. Свържете GitHub репозиторията с Vercel
2. Конфигурирайте environment variables
3. Deploy автоматично при push

### Backend
1. Upload към cloud provider (AWS, DigitalOcean, etc.)
2. Конфигурирайте MongoDB connection
3. Стартирайте с PM2 или подобен process manager

## 📱 Функционалности по страници

### Начална страница
- Hero секция с търсене
- Категории автомобили
- Препоръки и отзиви
- Информация за услугите

### Автомобили
- Списък с всички автомобили
- Филтриране по различни критерии
- Детайлна информация за всеки автомобил
- Проверка на наличност

### Резервация
- Форма за резервация
- Избор на дати и локации
- Валидация на данните
- Интеграция със Stripe за плащане

### Админ панел
- Dashboard с статистики
- Управление на автомобили
- Управление на резервации
- Управление на потребители

## 🔧 Конфигурация

### Преводи
Преводите се намират в `lib/translations.ts` и поддържат:
- Български език (bg)
- Английски език (en)

### API Endpoints
Основните API endpoints:
- `GET /cars` - Списък с автомобили
- `POST /reservations` - Създаване на резервация
- `GET /locations` - Списък с локации
- `POST /auth/login` - Вход в системата

## 🤝 Принос

1. Fork проекта
2. Създайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit промените (`git commit -m 'Add some AmazingFeature'`)
4. Push към branch-а (`git push origin feature/AmazingFeature`)
5. Отворете Pull Request

## 📄 Лиценз

Този проект е лицензиран под MIT License - вижте [LICENSE](LICENSE) файла за детайли.

## 📞 Контакти

- **Email**: ivanrent11@gmail.com
- **Офис**: Слънчев бряг, България
- **Телефон**: 0894818283

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) за отличния React framework
- [Tailwind CSS](https://tailwindcss.com/) за CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) за UI компонентите
- [Stripe](https://stripe.com/) за плащанията 