import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import '../styles/Summary.css';

export default function Summary({ selectedCategory, selectedMonth }) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredAmount, setFilteredAmount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  useEffect(() => {
    // Подписка на все расходы для расчета общей суммы
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let allExpenses = [];
      snapshot.forEach((doc) => {
        allExpenses.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Общая сумма всех расходов
      const total = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      setTotalAmount(total);

      // Фильтрованная сумма
      let filtered = allExpenses;

      if (selectedCategory !== 'all') {
        filtered = filtered.filter((e) => e.category === selectedCategory);
      }

      if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        filtered = filtered.filter((e) => {
          const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
          return (
            date.getFullYear() === parseInt(year) &&
            date.getMonth() === parseInt(month) - 1
          );
        });
      }

      const filteredSum = filtered.reduce((sum, e) => sum + (e.amount || 0), 0);
      setFilteredAmount(filteredSum);
      setExpenseCount(filtered.length);
    });

    return () => unsubscribe();
  }, [selectedCategory, selectedMonth]);

  return (
    <div className="summary">
      <div className="summary-card total">
        <h3>Всего расходов</h3>
        <p className="amount">${totalAmount.toFixed(2)}</p>
      </div>

      <div className="summary-card filtered">
        <h3>
          {selectedMonth
            ? new Date(selectedMonth + '-01').toLocaleDateString('ru-RU', {
                month: 'long',
                year: 'numeric',
              })
            : 'Отфильтровано'}
        </h3>
        <p className="amount">${filteredAmount.toFixed(2)}</p>
        <span className="count">{expenseCount} позиций</span>
      </div>

      <div className="summary-card average">
        <h3>Средняя стоимость</h3>
        <p className="amount">
          ${expenseCount > 0 ? (filteredAmount / expenseCount).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  );
}
