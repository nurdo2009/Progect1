import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import { registerWithEmail, loginWithEmail, logout as logoutUser, db } from '../firebase/firebase';
import { useTranslations } from '../languages/translations';
import logo from '../assets/Logo TR.png';
import styles from '../styles/Home.module.css';

const CURRENCY_SYMBOLS = {
  USD: '$',
  RUB: '₽',
  KGS: 'сом',
  TRY: '₺',
};

export default function Home({ theme, onToggleTheme, language = 'ru', onToggleLanguage }) {
  const t = useTranslations(language);
  
  const pages = [
    { id: 'dashboard', label: t.header.dashboard },
    { id: 'analytics', label: t.header.analytics },
    { id: 'features', label: t.header.features },
    { id: 'goals', label: t.header.goals },
    { id: 'reports', label: t.header.reports },
    { id: 'budgets', label: t.header.budgets },
    { id: 'savings', label: t.header.savings },
    { id: 'receipts', label: t.header.receipts },
    { id: 'notifications', label: t.header.notifications },
    { id: 'settings', label: t.header.settings },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [receiptFiles, setReceiptFiles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [importError, setImportError] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [goalTarget, setGoalTarget] = useState(120000);
  const [budgetLimit, setBudgetLimit] = useState(80000);
  const [savingsGoal, setSavingsGoal] = useState(100000);
  const [notifications, setNotifications] = useState([
    { id: 1, message: '🔔 Оплата подписки через 3 дня', active: true },
    { id: 2, message: '🔔 Перерасход в категории «Еда»', active: true },
    { id: 3, message: '🔔 Попробуй новый таргет в разделе «Цели»', active: false },
  ]);
  const [achievements] = useState([
    { id: 1, title: 'Первый расход', description: 'Добавлен первый расход', completed: true },
    { id: 2, title: 'Экономия месяца', description: 'Экономия более 15% бюджета', completed: false },
    { id: 3, title: 'План выполнен', description: 'Накоплено 50% цели', completed: false },
  ]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);

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

  const openAuthPanel = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthStatus('');
    setShowAuthPanel(true);
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthStatus('');

    if (!email.trim()) {
      setAuthError('Email обязателен');
      return;
    }

    if (!password) {
      setAuthError('Пароль обязателен');
      return;
    }

    try {
      setAuthLoading(true);
      const user = await loginWithEmail(email.trim(), password);
      setRegisteredUser(user);
      setAuthStatus('Вы успешно вошли!');
      setShowAuthPanel(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Firebase auth error:', error);
      const code = error?.code || '';
      if (code === 'auth/user-not-found') {
        setAuthError('Пользователь не найден. Проверьте email.');
      } else if (code === 'auth/wrong-password') {
        setAuthError('Неверный пароль. Попробуйте ещё раз.');
      } else if (code === 'auth/configuration-not-found') {
        setAuthError('Ошибка Firebase: включите Email/Password метод в Firebase Console.');
      } else {
        setAuthError(error.message || 'Не удалось войти.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Firebase logout error:', error);
    }

    setRegisteredUser(null);
    setAuthStatus('Вы вышли из аккаунта.');
    setShowAuthPanel(false);
    setAuthMode('login');
  };

  useEffect(() => {
    setLoadingExpenses(true);

    const expensesQuery = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const loadedExpenses = [];
        snapshot.forEach((doc) => {
          loadedExpenses.push({ id: doc.id, ...doc.data() });
        });
        setExpenses(loadedExpenses);
        setLoadingExpenses(false);
      },
      (error) => {
        console.error('Firebase expenses load error:', error);
        setLoadingExpenses(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredExpenses = useMemo(() => {
    let list = [...expenses];

    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      list = list.filter((item) => {
        const date = item.createdAt?.toDate?.() || new Date(item.createdAt);
        return (
          date.getFullYear() === parseInt(year, 10) &&
          date.getMonth() === parseInt(month, 10) - 1
        );
      });
    }

    return list;
  }, [expenses, selectedCategory, selectedMonth]);

  const totalSpent = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, item) => {
      const category = item.category || 'other';
      acc[category] = (acc[category] || 0) + (item.amount || 0);
      return acc;
    }, {});
  }, [expenses]);

  const budgetUsage = Math.min((totalSpent / budgetLimit) * 100, 100);
  const goalProgress = Math.min((totalSpent / goalTarget) * 100, 100);
  const savingsAmount = Math.max(0, savingsGoal - totalSpent * 0.15);
  const savingsProgress = Math.min((savingsAmount / savingsGoal) * 100, 100);

  const handleExportCsv = () => {
    const rows = [
      ['Название', 'Сумма', 'Категория', 'Дата'],
      ...filteredExpenses.map((item) => [
        item.title,
        item.amount,
        item.category,
        item.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || new Date(item.createdAt).toLocaleDateString('ru-RU'),
      ]),
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportMessage('Экспорт завершён. Файл скачан.');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const handleImportCsv = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportError('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = reader.result;
        const rows = text.split(/\r?\n/).map((row) => row.split(','));
        const items = rows.slice(1).map((row) => {
          const [title, amount, category, date] = row;
          return {
            title: title?.trim() || 'Импортированный расход',
            amount: parseFloat(amount) || 0,
            category: category?.trim() || 'other',
            createdAt: serverTimestamp(),
          };
        }).filter((item) => item.title && item.amount > 0);

        await Promise.all(items.map((item) => addDoc(collection(db, 'expenses'), item)));
      } catch (error) {
        setImportError(error.message || 'Не удалось импортировать файл.');
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReceiptUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptFiles((prev) => [
        {
          id: Date.now().toString(),
          name: file.name,
          url: reader.result,
          date: new Date().toLocaleDateString('ru-RU'),
        },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, active: false })));
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    localStorage.setItem('currency', value);
  };

  return (
    <div className={styles.home}>
      <header className={styles['app-header']}>
        <div className={styles['header-content']}>
          <div className={styles['header-brand']}>
            <div className={styles['brand-text']}>
              <div className={styles['brand-heading']}>
                <button
                  type="button"
                  className={`${styles['logo-box']} ${isLogoExpanded ? styles.expanded : ''}`}
                  onClick={() => setIsLogoExpanded(!isLogoExpanded)}
                  aria-label="Увеличить логотип"
                  title="Кликните, чтобы увеличить / закрыть логотип"
                >
                  <img src={logo} alt="Логотип трекера" className={styles.logo} />
                </button>
                <h1>💰 Трекер расходов</h1>
              </div>
              <p>Отслеживайте свои расходы и управляйте бюджетом</p>
            </div>

            <div className={styles['profile-area']}>
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

                    {!registeredUser && (
                      <div className={styles['profile-actions']}>
                        <button
                          type="button"
                          className={styles['profile-login']}
                          onClick={() => openAuthPanel('login')}
                        >
                          Войти
                        </button>
                        <button
                          type="button"
                          className={styles['profile-register']}
                          onClick={() => openAuthPanel('register')}
                        >
                          Зарегистрироваться
                        </button>
                      </div>
                    )}

                    {showAuthPanel && !registeredUser && (
                      <div className={styles['profile-auth-panel']}>
                        <form
                          onSubmit={authMode === 'login' ? handleLogin : handleRegister}
                          className={styles['auth-form']}
                        >
                          <h3>{authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}</h3>

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
                              placeholder="Введите пароль"
                              disabled={authLoading}
                            />
                          </label>

                          {authMode === 'register' && (
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
                          )}

                          {authError && <div className={styles['auth-error']}>{authError}</div>}
                          {authStatus && <div className={styles['auth-success']}>{authStatus}</div>}

                          <button type="submit" className={styles['auth-submit']} disabled={authLoading}>
                            {authLoading
                              ? authMode === 'login'
                                ? 'Вхожу...'
                                : 'Регистрирую...'
                              : authMode === 'login'
                              ? 'Войти'
                              : 'Создать аккаунт'}
                          </button>
                        </form>
                      </div>
                    )}

                    {registeredUser && (
                      <>
                        <div className={styles['profile-signed-in']}>
                          Вы вошли как <strong>{profileName}</strong>
                        </div>
                        <button
                          type="button"
                          className={styles['profile-logout']}
                          onClick={handleLogout}
                        >
                          Выйти
                        </button>
                      </>
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
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className={styles['currency-select']}
            >
              <option value="USD">USD ($)</option>
              <option value="RUB">RUB (₽)</option>
              <option value="KGS">KGS (сом)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
        </div>

        <div className={styles['header-tools']}>
          <button
            type="button"
            className={styles['language-btn']}
            onClick={onToggleLanguage}
            title="Toggle Language"
          >
            {language === 'ru' ? '🇷🇺 РУ' : '🇬🇧 EN'}
          </button>
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
              <div className={`${styles.section} ${styles['dashboard-grid']}`}>
                <div className={styles['summary-section']}>
                  <Summary
                    allExpenses={expenses}
                    filteredExpenses={filteredExpenses}
                    currency={currency}
                  />
                </div>
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
                <p>Визуализируй свои категории и найди, где можно сэкономить.</p>
                <div className={styles['analytics-grid']}>
                  <div className={styles['analytics-metric']}>
                    <span>💸 Потрачено всего</span>
                    <strong>{CURRENCY_SYMBOLS[currency]}{totalSpent.toFixed(2)}</strong>
                  </div>
                  <div className={styles['analytics-metric']}>
                    <span>📌 Активных записей</span>
                    <strong>{filteredExpenses.length}</strong>
                  </div>
                  <div className={styles['analytics-metric']}>
                    <span>📈 Бюджет использован</span>
                    <strong>{budgetUsage.toFixed(0)}%</strong>
                  </div>
                </div>

                <div className={styles['category-grid']}>
                  {Object.keys(categoryTotals).length === 0 ? (
                    <div className={styles['analytics-empty']}>Добавь расходы, чтобы увидеть разбивку по категориям.</div>
                  ) : (
                    Object.entries(categoryTotals).map(([category, amount]) => (
                      <div key={category} className={styles['category-card']}>
                        <span>{category === 'food' ? '🍕 Еда' : category === 'transport' ? '🚗 Транспорт' : category === 'tech' ? '💻 Техника' : '📌 Прочее'}</span>
                        <strong>{CURRENCY_SYMBOLS[currency]}{amount.toFixed(2)}</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activePage === 'features' && (
            <div className={`${styles.section} ${styles['features-section']}`}>
              <div className={styles['features-card']}>
                <h2>Приколюхи и фишки</h2>
                <ul className={styles['features-list']}>
                  <li>✨ Умный выбор валюты и запоминание настроек</li>
                  <li>📁 История расходов с поиском и фильтрами</li>
                  <li>📤 Экспорт и импорт CSV прямо в приложении</li>
                  <li>📸 Загрузка чеков и быстрый просмотр</li>
                  <li>🎯 Цели бюджета и прогресс-бар</li>
                  <li>🏆 Достижения и геймификация</li>
                </ul>

                <div className={styles['achievement-list']}>
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`${styles['achievement-card']} ${achievement.completed ? styles.completed : ''}`}
                    >
                      <div>
                        <strong>{achievement.title}</strong>
                        <p>{achievement.description}</p>
                      </div>
                      <span>{achievement.completed ? '✓' : '…'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'goals' && (
            <div className={`${styles.section} ${styles['goals-section']}`}>
              <div className={styles['feature-card']}>
                <h2>Цели бюджета</h2>
                <p>Смотри, как выполняются цели — отпуск, накопления и финансовая дисциплина.</p>
                <div className={styles['progress-group']}>
                  <div className={styles['progress-label']}>
                    <span>Цель: бюджет</span>
                    <strong>{goalProgress.toFixed(0)}%</strong>
                  </div>
                  <div className={styles['progress-bar']}>
                    <div className={styles['progress-fill']} style={{ width: `${goalProgress}%` }} />
                  </div>
                </div>
                <div className={styles['progress-group']}>
                  <div className={styles['progress-label']}>
                    <span>Накопления</span>
                    <strong>{savingsProgress.toFixed(0)}%</strong>
                  </div>
                  <div className={styles['progress-bar']}>
                    <div className={styles['progress-fill']} style={{ width: `${savingsProgress}%`, background: '#16a34a' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'reports' && (
            <div className={`${styles.section} ${styles['reports-section']}`}>
              <div className={styles['feature-card']}>
                <div className={styles['section-header']}>
                  <h2>Отчёты</h2>
                  <button
                    type="button"
                    className={styles['settings-button']}
                    onClick={handleExportCsv}
                  >
                    Скачать CSV
                  </button>
                </div>
                <p>Следи за трендом расходов и сохраняй отчёты для бухгалтерии.</p>
                <div className={styles['report-grid']}>
                  <div className={styles['report-card']}>Сегодня: <strong>{CURRENCY_SYMBOLS[currency]}{filteredExpenses.slice(0, 1).reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></div>
                  <div className={styles['report-card']}>Неделя: <strong>{CURRENCY_SYMBOLS[currency]}{filteredExpenses.slice(0, 7).reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></div>
                  <div className={styles['report-card']}>Месяц: <strong>{CURRENCY_SYMBOLS[currency]}{filteredExpenses.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></div>
                </div>
                {exportMessage && <p className={styles['export-success']}>{exportMessage}</p>}
              </div>
            </div>
          )}

          {activePage === 'budgets' && (
            <div className={`${styles.section} ${styles['budgets-section']}`}>
              <div className={styles['feature-card']}>
                <h2>Бюджет</h2>
                <p>Следи за категорией бюджета и не трать больше, чем планировал.</p>
                <div className={styles['progress-bar']}>
                  <div className={styles['progress-fill']} style={{ width: `${budgetUsage}%` }} />
                </div>
                <p className={styles['budget-caption']}>Использовано {budgetUsage.toFixed(0)}% от лимита</p>
              </div>
            </div>
          )}

          {activePage === 'savings' && (
            <div className={`${styles.section} ${styles['savings-section']}`}>
              <div className={styles['feature-card']}>
                <h2>Накопления</h2>
                <p>Прогресс показывает, как быстро ты приближаешься к финансовой свободе.</p>
                <div className={styles['progress-bar']}>
                  <div className={styles['progress-fill']} style={{ width: `${savingsProgress}%`, background: '#16a34a' }} />
                </div>
                <p className={styles['budget-caption']}>Осталось накопить {CURRENCY_SYMBOLS[currency]}{savingsAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {activePage === 'receipts' && (
            <div className={`${styles.section} ${styles['receipts-section']}`}>
              <div className={styles['feature-card']}>
                <div className={styles['section-header']}>
                  <h2>Чеки</h2>
                  <label className={styles['file-upload']}>
                    Загрузить чек
                    <input type="file" accept="image/*" onChange={handleReceiptUpload} />
                  </label>
                </div>
                <p>Загружай фото чеков и сохраняй записи рядом с расходами.</p>
                {receiptFiles.length === 0 ? (
                  <p>Пока нет загруженных чеков.</p>
                ) : (
                  <div className={styles['receipt-grid']}>
                    {receiptFiles.map((receipt) => (
                      <div key={receipt.id} className={styles['receipt-item']}>
                        <img src={receipt.url} alt={receipt.name} />
                        <strong>{receipt.name}</strong>
                        <span>{receipt.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activePage === 'notifications' && (
            <div className={`${styles.section} ${styles['notifications-section']}`}>
              <div className={styles['feature-card']}>
                <div className={styles['section-header']}>
                  <h2>Уведомления</h2>
                  <button
                    type="button"
                    className={styles['settings-button']}
                    onClick={markAllNotificationsRead}
                  >
                    Прочитано всё
                  </button>
                </div>
                <p>Система напомнит о больших покупках и выходе за бюджет.</p>
                <ul className={styles['notification-list']}>
                  {notifications.map((note) => (
                    <li key={note.id} className={note.active ? styles.activeNotification : ''}>
                      {note.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className={`${styles.section} ${styles['settings-section']}`}>
              <div className={styles['feature-card']}>
                <h2>Настройки</h2>
                <p>Меняй тему, валюту, уведомления и личные цели.</p>
                <div className={styles['settings-grid']}>
                  <button type="button" className={styles['settings-button']} onClick={onToggleTheme}>
                    Переключить тему
                  </button>
                  <button type="button" className={styles['settings-button']}>
                    Привязать карту
                  </button>
                </div>
                <div className={styles['settings-panel']}>
                  <label>
                    Валюта
                    <select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="RUB">RUB (₽)</option>
                      <option value="KGS">KGS (сом)</option>
                      <option value="TRY">TRY (₺)</option>
                    </select>
                  </label>
                  <div className={styles['import-export']}>
                    <label className={styles['file-upload']}>
                      Импортировать CSV
                      <input type="file" accept=".csv" onChange={handleImportCsv} />
                    </label>
                    <button type="button" className={styles['settings-button']} onClick={handleExportCsv}>
                      Экспортировать CSV
                    </button>
                  </div>
                  {importLoading && <p>Импортирование...</p>}
                  {importError && <p className={styles['auth-error']}>{importError}</p>}
                  {exportMessage && <p className={styles['export-success']}>{exportMessage}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Logo Overlay */}
      {isLogoExpanded && (
        <div
          className={styles['logo-overlay']}
          onClick={() => setIsLogoExpanded(false)}
        />
      )}

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
