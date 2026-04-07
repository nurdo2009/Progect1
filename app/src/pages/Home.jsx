import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import '../styles/Home.css';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');

  return (
    <div className="home">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Трекер расходов</h1>
          <p>Отслеживайте свои расходы и управляйте бюджетом</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Summary Statistics */}
          <Summary
            selectedCategory={selectedCategory}
            selectedMonth={selectedMonth}
          />

          {/* Add Expense Form */}
          <ExpenseForm />

          {/* Filters */}
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />

          {/* Expense List */}
          <ExpenseList
            selectedCategory={selectedCategory}
            selectedMonth={selectedMonth}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 Трекер расходов. Сделано с ❤️</p>
      </footer>
    </div>
  );
}
