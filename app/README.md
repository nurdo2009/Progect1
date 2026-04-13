# 💰 Expense Tracker - Production Ready Application

> Полнофункциональное приложение для отслеживания расходов
> 
> Построено с React + Vite + Firebase Firestore

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![Vite](https://img.shields.io/badge/Vite-8.0.4-purple)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)

---

## 🎯 Ключевые Особенности

### ✨ Функциональность
- ✅ **Реалтайм обновления** - Firestore `onSnapshot()` для мгновенного обновления UI
- ✅ **CRUD операции** - Добавление, получение и удаление расходов
- ✅ **Фильтрация** - По категориям и месяцам
- ✅ **Статистика** - Общая, фильтрованная сумма и среднее
- ✅ **Валидация** - Проверка данных перед отправкой
- ✅ **Loading & Error States** - Полная обработка состояний

### 🎨 Дизайн
- 🎭 Современный минималистичный интерфейс
- 🌈 Цветовая дифференциация категорий (Food🍕, Transport🚗, Other📌)
- 📱 Fully Responsive (мобильный-first)
- ✨ Плавные анимации и переходы
- 🎯 Интуитивная навигация

### ⚡ Производительность
- 📦 ~168 KB gzip (оптимизировано)
- ⚙️ React компоненты с Hooks
- 🔄 Эффективное управление состоянием
- 💾 Real-time Firestore sync

---

## 🚀 Быстрый Старт

```bash
# 1. Перейдите в директорию
cd app

# 2. Установите зависимости
npm install

# 3. Добавьте Firebase конфиг (см. SETUP_GUIDE.md)

# 4. Запустите dev сервер
npm run dev

# Готово! Откройте http://localhost:5173
```

---

## 📂 Структура Проекта

```
src/
├── components/
│   ├── ExpenseForm.jsx      # ➕ Форма добавления расходов
│   ├── ExpenseList.jsx      # 📋 Список с реалтайм обновлением
│   ├── ExpenseItem.jsx      # 🎫 Карточка одного расхода
│   ├── FilterBar.jsx        # 🔍 Фильтры по категории и месяцу
│   └── Summary.jsx          # 📊 Статистика и суммы
├── firebase/
│   └── firebase.js          # 🔥 Конфигурация Firebase
├── pages/
│   └── Home.jsx             # 🏠 Главная страница
├── styles/
│   ├── App.css              # 🎨 Глобальные стили
│   ├── Home.css
│   ├── ExpenseForm.css
│   ├── ExpenseList.css
│   ├── ExpenseItem.css
│   ├── FilterBar.css
│   └── Summary.css
├── App.jsx                  # Главный компонент
├── main.jsx                 # Точка входа
└── index.css                # Глобальные CSS переменные
```

---

## 🏗️ Архитектура Компонентов

```
App
└── Home
    ├── Summary          (📊 Статистика)
    ├── ExpenseForm      (➕ Добавление)
    ├── FilterBar        (🔍 Фильтры)
    └── ExpenseList
        └── ExpenseItem  (🎫 Карточка)
```

---

## 🔥 Firebase Firestore Structure

```firestore
expenses (collection)
├── title: string
├── amount: number
├── category: "food" | "transport" | "other"
└── createdAt: Timestamp
```

---

## 💻 Используемые Технологии

| Технология | Версия | Описание |
| --- | --- | --- |
| React | 19.2.4 | UI библиотека |
| Vite | 8.0.4 | Build tool |
| Firebase | Latest | Backend & Firestore |
| CSS3 | Native | Стили (Variables, Grid, Flexbox) |
| JavaScript | ES6+ | Логика приложения |

---

## 📱 Адаптивность

- 📱 **Mobile** (< 480px) - Оптимизировано для телефонов
- 📱 **Tablet** (480-768px) - Адаптированный layout
- 💻 **Desktop** (768px+) - Полный опыт

---

## 🎓 Что вы изучите

- ✅ Firestore real-time data sync & CRUD операции
- ✅ React Hooks (useState, useEffect)
- ✅ Component Composition & Props
- ✅ CSS Modules & CSS Variables
- ✅ Error Handling & Validation
- ✅ Responsive Design (мобильный-first)
- ✅ Performance Optimization
- ✅ State Management Patterns

---

## 📚 Дополнительная Информация

Для подробной информации о настройке Firebase откройте **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 📝 License

MIT License - Свободное использование

---

Made with ❤️ для portfolio junior+ / middle разработчика
