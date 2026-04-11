# 💰 Expense Tracker - Setup Guide

## 🚀 Быстрый Старт

### 1️⃣ Установка Зависимостей

```bash
cd app
npm install
```

### 2️⃣ Настройка Firebase

#### Создание проекта в Firebase:
1. Перейти на https://console.firebase.google.com
2. Создать новый проект (например, "expense-tracker")
3. В разделе **Firestore Database** создать базу данных
4. В разделе **Rules** установить:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Получение Конфига:
1. Перейти в **Project Settings** (значок шестеренки)
2. Выбрать вкладку **General**
3. Скопировать конфиг из раздела **Firebase SDK snippet** (выбрать **Config**)
4. Заменить значения в файле `src/firebase/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

#### Создание Firestore Коллекции:
1. В **Firestore Database** нажать "Start Collection"
2. Создать коллекцию с именем: `expenses`
3. Добавить первый документ вручную или использовать приложение

### 3️⃣ Запуск в Development

```bash
npm run dev
```

Приложение откроется на http://localhost:5173

### 4️⃣ Build для Production

```bash
npm run build
```

Результат будет в папке `dist/`

---

## 📂 Структура Проекта

```
src/
├── components/
│   ├── ExpenseForm.jsx      # Форма добавления расходов
│   ├── ExpenseList.jsx      # Список расходов с реалтайм обновлением
│   ├── ExpenseItem.jsx      # Карточка одного расхода
│   ├── FilterBar.jsx        # Фильтры по категории и месяцу
│   └── Summary.jsx          # Статистика и суммы
├── firebase/
│   └── firebase.js          # Конфигурация Firebase
├── pages/
│   └── Home.jsx             # Главная страница
├── styles/
│   ├── App.css              # Глобальные стили
│   ├── Home.css
│   ├── ExpenseForm.css
│   ├── ExpenseList.css
│   ├── ExpenseItem.css
│   ├── FilterBar.css
│   └── Summary.css
├── App.jsx                  # Главный компонент
├── main.jsx                 # Точка входа
└── index.css                # Глобальный CSS
```

---

## 🎯 Функциональность Приложения

### ✅ Реализованные Функции:

1. **Добавление Расхода**
   - Форма с полями: Title, Amount, Category
   - Валидация (не пусто, amount > 0)
   - Автоматическое добавление временной метки

2. **Реалтайм Обновление**
   - Использование Firebase `onSnapshot()`
   - Автоматическое обновление списка без перезагрузки

3. **Удаление Расхода**
   - Кнопка Delete в каждой карточке
   - Подтверждение перед удалением

4. **Фильтрация**
   - По категории (All / Food / Transport / Other)
   - По месяцу (месячный фильтр)

5. **Статистика**
   - Общая сумма всех расходов
   - Сумма за выбранный период
   - Средняя стоимость

6. **UI/UX**
   - Современный минималистичный дизайн
   - Карточки с мягкими тенями
   - Цветовая дифференциация категорий
   - Плавные анимации
   - Адаптивный дизайн (mobile-first)
   - Пустое состояние (No expenses)
   - Loading состояние

---

## 🎨 Цветовая Схема Категорий

| Категория | Цвет      | Код     |
| --------- | --------- | ------- |
| Food      | Зеленый   | #4CAF50 |
| Transport | Синий     | #2196F3 |
| Other     | Фиолетовый| #9C27B0 |

---

## 🔍 Использованные Технологии

- **React 19.2.4** - UI библиотека
- **Vite 8.0.4** - Build tool
- **Firebase** - Backend и Firestore
- **CSS3** - Стили (CSS Variables, Grid, Flexbox)
- **JavaScript ES6+** - Логика приложения

---

## 📱 Адаптивность

Приложение полностью адаптивно:
- **Desktop** (1024px+) - Оптимальный вид
- **Tablets** (769-1023px) - Адаптированный layout
- **Mobile** (max 768px) - Полностью оптимизирован

---

## 🐛 Troubleshooting

### Firestore нет данных
- Проверьте правила доступа в Firestore Security Rules
- Убедитесь, что вы залогированы (если используется Auth)

### Стили не применяются
- Очистить кэш браузера (Ctrl + Shift + Delete)
- Перезагрузить dev сервер (`npm run dev`)

### Firebase ошибки
- Проверьте правильність конфига в `src/firebase/firebase.js`
- Убедитесь, что API включены в Firebase Console

---

## 📝 Примечания

- Приложение использует `serverTimestamp()` для автоматической временной метки
- Данные сортируются по дате (новые сверху)
- Компоненты используют React Hooks (useState, useEffect)
- CSS использует CSS Variables для легкой кастомизации

---

## 🎓 Для Portfolio

Этот проект демонстрирует:
- ✅ Работа с Firebase Firestore (real-time updates)
- ✅ React компоненты и hooks
- ✅ Состояние приложения (state management)
- ✅ Современный CSS (Grid, Flexbox, Animations)
- ✅ Обработка ошибок и валидация
- ✅ Адаптивный дизайн
- ✅ Best practices в структуре кода

---

Сделано с ❤️ для portfolio junior+ / middle разработчика.
