# Rent A Car API Документация

## Съдържание
- [Автентикация](#автентикация)
- [Автомобили](#автомобили)
- [Локации](#локации)
- [Резервации](#резервации)
- [Обработка на грешки](#обработка-на-грешки)

## Автентикация

### Регистрация на потребител
- **URL:** `/register`
- **Метод:** `POST`
- **Описание:** Създаване на нов потребителски акаунт
- **Тяло на заявката:**
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string"
  }
  ```
- **Успешен отговор:**
  - **Код:** 201 CREATED
  - **Съдържание:** Потребителски обект с токен

### Вход в системата
- **URL:** `/login`
- **Метод:** `POST`
- **Описание:** Автентикация на потребител
- **Тяло на заявката:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Успешен отговор:**
  - **Код:** 200 OK
  - **Съдържание:** Токен за достъп и информация за потребителя

## Автомобили

### Списък с всички автомобили
- **URL:** `/cars`
- **Метод:** `GET`
- **Изисква автентикация:** Не
- **Описание:** Връща списък с всички налични автомобили
- **Успешен отговор:**
  - **Код:** 200 OK
  - **Примерно съдържание:**
    ```json
    [
      {
        "id": "string",
        "brand": "string",
        "model": "string",
        "year": "number",
        "price": "number",
        "location": "string",
        "image": "string",
        "available": "boolean"
      }
    ]
    ```

### Детайли за конкретен автомобил
- **URL:** `/cars/:id`
- **Метод:** `GET`
- **Изисква автентикация:** Не
- **Описание:** Връща подробна информация за конкретен автомобил
- **Параметри в URL-а:**
  - `id`: ID на автомобила
- **Успешен отговор:**
  - **Код:** 200 OK
  - **Примерно съдържание:**
    ```json
    {
      "id": "string",
      "brand": "string",
      "model": "string",
      "year": "number",
      "price": "number",
      "location": "string",
      "image": "string",
      "available": "boolean",
      "features": ["string"],
      "description": "string"
    }
    ```

## Локации

### Списък с всички локации
- **URL:** `/locations`
- **Метод:** `GET`
- **Изисква автентикация:** Не
- **Описание:** Връща списък с всички налични локации
- **Успешен отговор:**
  - **Код:** 200 OK
  - **Примерно съдържание:**
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "address": "string",
        "city": "string",
        "workingHours": {
          "open": "string",
          "close": "string"
        }
      }
    ]
    ```

### Детайли за конкретна локация
- **URL:** `/locations/:id`
- **Метод:** `GET`
- **Изисква автентикация:** Не
- **Описание:** Връща подробна информация за конкретна локация
- **Параметри в URL-а:**
  - `id`: ID на локацията
- **Успешен отговор:**
  - **Код:** 200 OK
  - **Примерно съдържание:**
    ```json
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "city": "string",
      "workingHours": {
        "open": "string",
        "close": "string"
      },
      "coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "availableCars": ["string"]
    }
    ```

## Резервации

### Създаване на резервация
- **URL:** `/reservations`
- **Метод:** `POST`
- **Изисква автентикация:** Да
- **Описание:** Създава нова резервация за автомобил
- **Тяло на заявката:**
  ```json
  {
    "carId": "string",
    "fromDate": "YYYY-MM-DD",
    "toDate": "YYYY-MM-DD",
    "fromTime": "HH:mm",
    "toTime": "HH:mm",
    "fromPlace": "string",
    "toPlace": "string",
    "customerName": "string",
    "email": "string",
    "phone": "string"
  }
  ```
- **Успешен отговор:**
  - **Код:** 201 CREATED
  - **Примерно съдържание:**
    ```json
    {
      "id": "string",
      "carId": "string",
      "fromDateTime": "string",
      "toDateTime": "string",
      "fromPlace": "string",
      "toPlace": "string",
      "status": "string",
      "totalPrice": "number"
    }
    ```

### Преглед на резервации
- **URL:** `/reservations`
- **Метод:** `GET`
- **Изисква автентикация:** Да
- **Описание:** Връща списък с всички резервации на потребителя
- **Успешен отговор:**
  - **Код:** 200 OK
  - **Примерно съдържание:**
    ```json
    [
      {
        "id": "string",
        "carId": "string",
        "fromDateTime": "string",
        "toDateTime": "string",
        "fromPlace": "string",
        "toPlace": "string",
        "status": "string",
        "totalPrice": "number"
      }
    ]
    ```

## Обработка на грешки

### Формати на грешките
Всички грешки връщат JSON отговор със следната структура:
```json
{
  "error": "Описание на грешката"
}
```

### Кодове на грешките
- **400 Bad Request**
  - Липсващи задължителни полета
  - Невалидни данни
- **401 Unauthorized**
  - Липсващ или невалиден токен за достъп
- **403 Forbidden**
  - Недостатъчни права за достъп
- **404 Not Found**
  - Ресурсът не е намерен
- **409 Conflict**
  - Автомобилът не е наличен за избрания период
- **500 Internal Server Error**
  - Възникнала е грешка в сървъра

### Важни забележки

1. **Автентикация**
   - За защитените endpoints е необходим валиден JWT токен
   - Токенът трябва да се подаде в хедъра:
     ```
     Authorization: Bearer <your_token>
     ```

2. **Формат на датите и часовете**
   - Дати: `YYYY-MM-DD` (например: "2024-03-20")
   - Часове: `HH:mm` (например: "14:30")

3. **Валидация на резервации**
   - Системата автоматично проверява наличността на автомобила
   - Проверява се възможността за преместване между локации
   - Всички задължителни полета трябва да бъдат попълнени

4. **Ограничения**
   - Резервации могат да се правят само за бъдещи дати
   - Минималният период за наемане е 1 ден
   - Работното време на локациите трябва да се съобрази при избор на час 

# Rent a Car API Documentation

This document provides detailed information about the Rent a Car API endpoints.

## Base URL
```
http://localhost:8800
```

## Authentication
Some endpoints require authentication. For these endpoints, you need to include a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Available Cars

#### GET /reservations/cars/available

Returns a list of available cars based on specified pickup and return parameters.

##### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pickupTime | string | Yes | The date and time for car pickup (ISO 8601 format) |
| returnTime | string | Yes | The date and time for car return (ISO 8601 format) |
| pickupLocation | string | Yes | The location ID where the car will be picked up |
| returnLocation | string | Yes | The location ID where the car will be returned |

##### Example Request
```http
GET http://localhost:8800/reservations/cars/available?pickupTime=2024-03-20T10:00:00Z&returnTime=2024-03-22T10:00:00Z&pickupLocation=location_id&returnLocation=location_id
```

##### Success Response (200 OK)
```json
{
    "count": 2,
    "cars": [
        {
            "_id": "car_id",
            "model": "Car Model",
            "brand": "Car Brand",
            "year": 2023,
            "currentLocation": {
                "_id": "location_id",
                "name": "Location Name",
                "address": "Location Address"
            }
        }
    ]
}
```

##### Error Responses

###### 400 Bad Request
When required parameters are missing:
```json
{
    "error": "Моля, въведете всички задължителни полета: час на взимане, час на оставяне, място на взимане и място на оставяне"
}
```

When datetime format is invalid:
```json
{
    "error": "Невалиден формат на дата и час"
}
```

When pickup time is after or equal to return time:
```json
{
    "error": "Часът на взимане трябва да бъде преди часа на оставяне"
}
```

###### 500 Internal Server Error
When server encounters an error:
```json
{
    "error": "Възникна грешка при търсенето на налични автомобили"
}
```

##### Notes
- The endpoint checks for car availability considering existing reservations and location constraints
- Dates should be provided in ISO 8601 format (e.g., "2024-03-20T10:00:00Z")
- The response includes populated location data for each available car
- The endpoint is public and does not require authentication
- The count field in the response indicates the total number of available cars matching the criteria 