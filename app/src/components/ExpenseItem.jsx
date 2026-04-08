import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import styles from '../styles/ExpenseItem.module.css';

const CATEGORY_ICONS = {
  food: '🍕',
  transport: '🚗',
  other: '📌',
};

const CATEGORY_COLORS = {
  food: '#4CAF50',    // зеленый
  transport: '#2196F3', // синий
  other: '#9C27B0',   // фиолетовый
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  RUB: '₽',
  KGS: 'сом',
  TRY: '₺',
};

export default function ExpenseItem({ expense, currency = 'USD' }) {
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот расход?')) {
      try {
        await deleteDoc(doc(db, 'expenses', expense.id));
      } catch (err) {
        alert('Ошибка при удалении: ' + err.message);
      }
    }
  };

  // Преобразование Timestamp → Date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Нет даты';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={styles['expense-item']}
      style={{ borderLeftColor: CATEGORY_COLORS[expense.category] }}
    >
      <div className={styles['expense-icon']}>
        {CATEGORY_ICONS[expense.category] || '📌'}
      </div>

      <div className={styles['expense-details']}>
        <h4 className={styles['expense-title']}>{expense.title}</h4>
        <p className={styles['expense-date']}>{formatDate(expense.createdAt)}</p>
      </div>

      <div className={styles['expense-amount']}>{CURRENCY_SYMBOLS[currency]}{expense.amount.toFixed(2)}</div>

      <button
        className={styles['btn-delete']}
        onClick={handleDelete}
        title="Удалить расход"
      >
        ✕
      </button>
    </div>
  );
}
