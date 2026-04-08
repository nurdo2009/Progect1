import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import styles from '../styles/Summary.module.css';

const CURRENCY_SYMBOLS = {
  USD: '$',
  RUB: '₽',
  KGS: 'сом',
  TRY: '₺',
};

export default function Summary({ selectedCategory, selectedMonth, currency = 'USD' }) {
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
    <div className={styles.summary}>
      <div className={`${styles['summary-card']} ${styles.total}`}>
        <h3>Всего расходов</h3>
        <p className={styles.amount}>{CURRENCY_SYMBOLS[currency]}{totalAmount.toFixed(2)}</p>
      </div>

      <div className={`${styles['summary-card']} ${styles.filtered}`}>
        <h3>
          {selectedMonth
            ? new Date(selectedMonth + '-01').toLocaleDateString('ru-RU', {
                month: 'long',
                year: 'numeric',
              })
            : 'Отфильтровано'}
        </h3>
        <p className={styles.amount}>{CURRENCY_SYMBOLS[currency]}{filteredAmount.toFixed(2)}</p>
        <span className={styles.count}>{expenseCount} позиций</span>
      </div>

      <div className={`${styles['summary-card']} ${styles.average}`}>
        <h3>Средняя стоимость</h3>
        <p className={styles.amount}>
          {CURRENCY_SYMBOLS[currency]}{expenseCount > 0 ? (filteredAmount / expenseCount).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  );
}
