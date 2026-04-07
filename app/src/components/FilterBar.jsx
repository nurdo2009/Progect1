import '../styles/FilterBar.css';

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
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="category-select">Категория</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">Все категории</option>
          <option value="food">🍕 Еда</option>
          <option value="transport">🚗 Транспорт</option>
          <option value="other">📌 Прочее</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="month-select">Месяц</label>
        <input
          id="month-select"
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="filter-input"
        />
      </div>

      {selectedMonth && (
        <button
          className="btn-reset"
          onClick={() => onMonthChange('')}
          title="Очистить фильтр месяца"
        >
          Очистить
        </button>
      )}
    </div>
  );
}
