import styles from '../styles/Summary.module.css';

const CURRENCY_SYMBOLS = {
  USD: '$',
  RUB: '₽',
  KGS: 'сом',
  TRY: '₺',
};

export default function Summary({ allExpenses = [], filteredExpenses = [], currency = 'USD' }) {
  const totalAmount = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const filteredAmount = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const expenseCount = filteredExpenses.length;

  return (
    <div className={styles.summary}>
      <div className={`${styles['summary-card']} ${styles.total}`}>
        <h3>Всего расходов</h3>
        <p className={styles.amount}>{CURRENCY_SYMBOLS[currency]}{totalAmount.toFixed(2)}</p>
      </div>

      <div className={`${styles['summary-card']} ${styles.filtered}`}>
        <h3>Фильтрованные</h3>
        <p className={styles.amount}>{CURRENCY_SYMBOLS[currency]}{filteredAmount.toFixed(2)}</p>
        <span className={styles.count}>{expenseCount} позиций</span>
      </div>

      <div className={`${styles['summary-card']} ${styles.average}`}>
        <h3>Средняя цена</h3>
        <p className={styles.amount}>
          {CURRENCY_SYMBOLS[currency]}{expenseCount > 0 ? (filteredAmount / expenseCount).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  );
}
