import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ExpenseItem from './ExpenseItem';
import '../styles/ExpenseList.css';

export default function ExpenseList({ selectedCategory, selectedMonth }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // Создать query с сортировкой по дате (новые сверху)
    const q = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    // Подписка на реалтайм обновления
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let expensesList = [];
        snapshot.forEach((doc) => {
          expensesList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Фильтрация по категории
        if (selectedCategory !== 'all') {
          expensesList = expensesList.filter(
            (e) => e.category === selectedCategory
          );
        }

        // Фильтрация по месяцу
        if (selectedMonth) {
          const [year, month] = selectedMonth.split('-');
          expensesList = expensesList.filter((e) => {
            const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
            return (
              date.getFullYear() === parseInt(year) &&
              date.getMonth() === parseInt(month) - 1
            );
          });
        }

        setExpenses(expensesList);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Ошибка при загрузке расходов');
        setLoading(false);
      }
    );

    // Очистка подписки при размонтировании
    return () => unsubscribe();
  }, [selectedCategory, selectedMonth]);

  if (loading) {
    return <div className="loading">Загружаю расходы...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>Расходов нет</h3>
        <p>Начните отслеживать свои расходы!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2>Расходы</h2>
      <div className="expenses-container">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
}
