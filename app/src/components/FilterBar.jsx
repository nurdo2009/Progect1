import styles from '../styles/FilterBar.module.css';

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedMonth,
  onMonthChange,
}) {
  // Получить текущий месяц в формате YYYY-MM
  const getCurrentMonth = () => {
    const today = new Date();
    return today.toISOString().slice(0, 7);
  };

  return (
    <div className={styles['filter-bar']}>
      <div className={styles['filter-group']}>
        <label htmlFor="category-select">Категория</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles['filter-select']}
        >
          <option value="all">Все категории</option>
          <option value="food">🍕 Еда</option>
          <option value="transport">🚗 Транспорт</option>
          <option value="other">📌 Прочее</option>
        </select>
      </div>

      <div className={styles['filter-group']}>
        <label htmlFor="month-select">Месяц</label>
        <input
          id="month-select"
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className={styles['filter-input']}
        />
      </div>

      {selectedMonth && (
        <button
          className={styles['btn-reset']}
          onClick={() => onMonthChange('')}
          title="Очистить фильтр месяца"
        >
          Очистить
        </button>
      )}
    </div>
  );
}
