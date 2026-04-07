import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import '../styles/ExpenseForm.css';

export default function ExpenseForm() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (!title.trim()) {
      setError('Название обязательно');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Сумма должна быть больше 0');
      return;
    }

    try {
      setLoading(true);

      // Добавить документ в Firestore
      await addDoc(collection(db, 'expenses'), {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        createdAt: serverTimestamp(),
      });

      // Очистить форму
      setTitle('');
      setAmount('');
      setCategory('food');
    } catch (err) {
      setError(err.message || 'Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Добавить расход</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            placeholder="например, Кофе"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Сумма ($)</label>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="food">🍕 Еда</option>
            <option value="transport">🚗 Транспорт</option>
            <option value="other">📌 Прочее</option>
          </select>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Добавляю...' : 'Добавить расход'}
        </button>
      </form>
    </div>
  );
}
