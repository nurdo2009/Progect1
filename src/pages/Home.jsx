import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import { registerWithEmail } from '../firebase/firebase';
import logo from '../assets/Logo TR.png';
import styles from '../styles/Home.module.css';

const pages = [
  { id: 'dashboard', label: 'Главная' },
  { id: 'analytics', label: 'Аналитика' },
  { id: 'features', label: 'Фишки' },
];

export default function Home({ theme, onToggleTheme }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const profiles = [
    { id: 'personal', label: 'Личный', status: 'online' },
    { id: 'work', label: 'Рабочий', status: 'busy' },
    { id: 'family', label: 'Семья', status: 'away' },
  ];
  const [activeProfileId, setActiveProfileId] = useState('personal');

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) || profiles[0];

  const getProfileName = (emailAddress) => {
    if (!emailAddress) return 'Гость';
    const name = emailAddress.split('@')[0].replace(/[^a-zA-Z0-9а-яА-ЯЁё]/g, '');
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Профиль';
  };

  const profileName = getProfileName(registeredUser?.email);
  const profileInitial = profileName[0] || 'G';

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthStatus('');

    if (!email.trim()) {
      setAuthError('Email обязателен');
      return;
    }

    if (password.length < 6) {
      setAuthError('Пароль должен быть минимум 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Пароли не совпадают');
      return;
    }

    try {
      setAuthLoading(true);
      const user = await registerWithEmail(email.trim(), password);
      setRegisteredUser(user);
      setAuthStatus('Регистрация прошла успешно! Добро пожаловать.');
      setShowAuthPanel(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Firebase auth error:', error);
      const code = error?.code || '';
      if (code === 'auth/configuration-not-found') {
        setAuthError('Ошибка Firebase: включите Email/Password метод в Firebase Console.');
      } else if (code === 'auth/email-already-in-use') {
        setAuthError('Этот email уже зарегистрирован.');
      } else {
        setAuthError(error.message || 'Не удалось зарегистрироваться.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className={styles.home}>
      <header className={styles['app-header']}>
        <div className={styles['header-content']}>
          <div className={styles['header-brand']}>
            <h1>💰 Трекер расходов</h1>
            <div className={styles['logo-box']}>
              <img src={logo} alt="Логотип трекера" className={styles.logo} />
            </div>
          </div>
          <p>Отслеживайте свои расходы и управляйте бюджетом</p>

          <div className={styles['page-nav']}>
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={`${styles['page-button']} ${activePage === page.id ? styles.active : ''}`}
                onClick={() => setActivePage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </div>
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

          <div className={styles['header-actions']}>
            <div className={styles['profile-widget']}>
              <button
                type="button"
                className={styles['profile-button']}
                onClick={() => setShowProfileMenu((prev) => !prev)}
                aria-label="Профиль"
                aria-expanded={showProfileMenu}
              >
                <span className={styles['profile-avatar']}>{profileInitial || '👤'}</span>
              </button>

              {showProfileMenu && (
                <div className={styles['profile-menu']}>
                  <div className={styles['profile-menu-header']}>
                    <strong>{profileName}</strong>
                    <span>{activeProfile.label} профиль</span>
                  </div>

                  <div className={styles['profile-heading']}>Управление</div>

                  {!registeredUser && !showAuthPanel && (
                    <button
                      type="button"
                      className={styles['profile-register']}
                      onClick={() => setShowAuthPanel(true)}
                    >
                      Регистрация
                    </button>
                  )}

                  {showAuthPanel && !registeredUser && (
                    <div className={styles['profile-auth-panel']}>
                      <form onSubmit={handleRegister} className={styles['auth-form']}>
                        <label>
                          Email
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@mail.com"
                            disabled={authLoading}
                          />
                        </label>

                        <label>
                          Пароль
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Минимум 6 символов"
                            disabled={authLoading}
                          />
                        </label>

                        <label>
                          Подтверждение
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите пароль"
                            disabled={authLoading}
                          />
                        </label>

                        {authError && <div className={styles['auth-error']}>{authError}</div>}
                        {authStatus && <div className={styles['auth-success']}>{authStatus}</div>}

                        <button type="submit" className={styles['auth-submit']} disabled={authLoading}>
                          {authLoading ? 'Регистрирую...' : 'Создать аккаунт'}
                        </button>
                      </form>
                    </div>
                  )}

                  {registeredUser && (
                    <div className={styles['profile-signed-in']}>
                      Вы вошли как <strong>{profileName}</strong>
                    </div>
                  )}

                  <div className={styles['profile-heading']}>Профили</div>
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      className={`${styles['profile-item']} ${profile.id === activeProfileId ? styles.active : ''}`}
                      onClick={() => {
                        setActiveProfileId(profile.id);
                        setShowProfileMenu(false);
                      }}
                    >
                      <span>{profile.label}</span>
                      <span className={styles['profile-item-status']}>
                        {profile.status === 'online' ? 'Онлайн' : profile.status === 'busy' ? 'Занят' : 'Отошел'}
                      </span>
                    </button>
                  ))}
                  <button type="button" className={styles['profile-add']}>
                    + Добавить профиль
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles['header-tools']}>
          <button
            className={styles['theme-toggle']}
            onClick={onToggleTheme}
            title={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className={styles['history-btn']}
            onClick={() => setIsHistoryOpen(true)}
            title="История покупок"
          >
            🗂️
          </button>
        </div>
      </header>

      <main className={styles['app-main']}>
        <div className={styles.container}>
          {activePage === 'dashboard' && (
            <>
              <div className={`${styles.section} ${styles['summary-section']}`}>
                <Summary
                  selectedCategory={selectedCategory}
                  selectedMonth={selectedMonth}
                  currency={currency}
                />
              </div>

              <div className={`${styles.section} ${styles['form-section']}`}>
                <ExpenseForm currency={currency} />
              </div>
            </>
          )}

          {activePage === 'analytics' && (
            <div className={`${styles.section} ${styles['analytics-section']}`}>
              <div className={styles['analytics-card']}>
                <h2>Аналитика расходов</h2>
                <p>Здесь будут графики и ключевые показатели, которые помогут вам увидеть, куда уходят деньги.</p>
                <div className={styles['analytics-grid']}>
                  <div className={styles['analytics-metric']}>
                    <span>🔥 Рост затрат</span>
                    <strong>+12%</strong>
                  </div>
                  <div className={styles['analytics-metric']}>
                    <span>💡 Экономия</span>
                    <strong>3 категории</strong>
                  </div>
                  <div className={styles['analytics-metric']}>
                    <span>📊 Самая дорогая</span>
                    <strong>Путешествия</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'features' && (
            <div className={`${styles.section} ${styles['features-section']}`}>
              <div className={styles['features-card']}>
                <h2>Приколюхи и фишки</h2>
                <ul className={styles['features-list']}>
                  <li>✨ Умный выбор валюты</li>
                  <li>📁 История расходов в красивом модальном окне</li>
                  <li>🔒 Регистрация прямо в шапке</li>
                  <li>🌗 Тёмная тема с плавным переключением</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* History Modal */}
      {isHistoryOpen && (
        <div className={styles['modal-overlay']} onClick={() => setIsHistoryOpen(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2>История покупок</h2>
              <button 
                className={styles['modal-close']}
                onClick={() => setIsHistoryOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles['modal-body']}>
              {/* Filters */}
              <div className={styles['filter-section']}>
                <FilterBar
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>

              {/* Expense List */}
              <div className={styles['list-section']}>
                <ExpenseList
                  selectedCategory={selectedCategory}
                  selectedMonth={selectedMonth}
                  currency={currency}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={styles['app-footer']}>
        <p>© 2026 Трекер расходов. Сделано с ❤️</p>
      </footer>
    </div>
  );
}
