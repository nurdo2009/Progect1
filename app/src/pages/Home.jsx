import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import '../styles/Home.css';

export default function Home({ theme, onToggleTheme }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="home">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Трекер расходов</h1>
          <p>Отслеживайте свои расходы и управляйте бюджетом</p>
        </div>
        <div className="header-controls">
          <div className="currency-selector">
            <label htmlFor="currency">Валюта:</label>
            <select 
              id="currency" 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
            >
              <option value="USD">USD ($)</option>
              <option value="RUB">RUB (₽)</option>
              <option value="KGS">KGS (сом)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
          <button 
            className="theme-toggle" 
            onClick={onToggleTheme}
            title={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Summary Statistics */}
          <div className="section summary-section">
            <Summary
              selectedCategory={selectedCategory}
              selectedMonth={selectedMonth}
              currency={currency}
            />
          </div>

          {/* Add Expense Form */}
          <div className="section form-section">
            <ExpenseForm currency={currency} />
          </div>

          {/* Filters */}
          <div className="section filter-section">
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* Expense List */}
          <div className="section list-section">
            <ExpenseList
              selectedCategory={selectedCategory}
              selectedMonth={selectedMonth}
              currency={currency}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Трекер расходов. Сделано с ❤️</p>
      </footer>
    </div>
  );
}
