import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import styles from '../styles/Home.module.css';

export default function Home({ theme, onToggleTheme }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className={styles.home}>
      <header className={styles['app-header']}>
        <div className={styles['header-content']}>
          <h1>💰 Трекер расходов</h1>
          <p>Отслеживайте свои расходы и управляйте бюджетом</p>
        </div>
        <div className={styles['header-controls']}>
          <div className={styles['currency-selector']}>
            <label htmlFor="currency">Валюта:</label>
            <select 
              id="currency" 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className={styles['currency-select']}
            >
              <option value="USD">USD ($)</option>
              <option value="RUB">RUB (₽)</option>
              <option value="KGS">KGS (сом)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
          <button 
            className={styles['theme-toggle']} 
            onClick={onToggleTheme}
            title={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className={styles['app-main']}>
        <div className={styles.container}>
          {/* Summary Statistics */}
          <div className={`${styles.section} ${styles['summary-section']}`}>
            <Summary
              selectedCategory={selectedCategory}
              selectedMonth={selectedMonth}
              currency={currency}
            />
          </div>

          {/* Add Expense Form */}
          <div className={`${styles.section} ${styles['form-section']}`}>
            <ExpenseForm currency={currency} />
          </div>

          {/* Filters */}
          <div className={`${styles.section} ${styles['filter-section']}`}>
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* Expense List */}
          <div className={`${styles.section} ${styles['list-section']}`}>
            <ExpenseList
              selectedCategory={selectedCategory}
              selectedMonth={selectedMonth}
              currency={currency}
            />
          </div>
        </div>
      </main>

      <footer className={styles['app-footer']}>
        <p>© 2026 Трекер расходов. Сделано с ❤️</p>
      </footer>
    </div>
  );
}
