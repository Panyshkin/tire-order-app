// src/js/constants.js
// Константы приложения

// Ключи для localStorage
export const STORAGE_KEYS = {
  MECHANICS: 'tireShop_mechanics',
  MATERIALS: 'tireShop_materials',
  SERVICES: 'tireShop_services_v2',
  STATE: 'tireShop_state',
  ORDERS: 'tireShop_orders',
  SUBDIVISION: 'tireShop_selectedSubdivision'
};

// Параметры колёс
export const WHEELS = {
  // Доступные радиусы от 13 до 24
  RADII: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  
  // Типы колёс
  TYPES: [
    { id: 'light', label: 'Легковая', icon: 'fa-car' },
    { id: 'jeep', label: 'Джип/минивэн/кроссовер', icon: 'fa-truck-monster' },
    { id: 'lowProfile', label: 'Низкий профиль', icon: 'fa-bolt' },
    { id: 'runflat', label: 'RunFlat', icon: 'fa-shield-halved' }
  ],
  
  // Ограничения количества
  MIN_QTY: 1,
  MAX_QTY: 20,
  
  // Значения по умолчанию
  DEFAULT_QTY: 4,
  DEFAULT_RADIUS: 17,
  DEFAULT_TYPE: 'light',
  DEFAULT_LOW_PROFILE: false,
  DEFAULT_RUNFLAT: false
};

// API endpoints
export const API = {
  BASE_URL: 'https://1c-proxy-vercel.vercel.app/api',
  ENDPOINTS: {
    GET_SETTINGS: '/get-settings',
    CREATE_ORDER: '/create-order'
  }
};

// Подразделения по умолчанию
export const DEFAULT_SUBDIVISION = 'Оренбург';

// Фильтры для истории
export const HISTORY_FILTERS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  ALL: 'all'
};

export const HISTORY_FILTERS_LABELS = {
  [HISTORY_FILTERS.TODAY]: 'Сегодня',
  [HISTORY_FILTERS.WEEK]: 'Неделя',
  [HISTORY_FILTERS.MONTH]: 'Месяц',
  [HISTORY_FILTERS.ALL]: 'Все'
};

// Регулярные выражения для парсинга услуг из 1С
export const SERVICE_PATTERNS = {
  // Поиск радиуса: R13, R14-16, R21 и т.д.
  RADIUS: /r(\d{2})(?:-(\d{2}))?/i,
  
  // Поиск типа автомобиля
  CAR_TYPE: {
    LIGHT: /легков|легк/i,
    JEEP: /джип|минивэн|кроссовер|паркетник|внедорож|внедорожник/i
  },
  
  // Поиск специальных параметров
  LOW_PROFILE: /низкий профиль/i,
  RUNFLAT: /runflat/i,
  
  // Поиск префикса для комплексных услуг (1-5)
  COMPLEX_PREFIX: /^[1-5]\s/
};

// ID модальных окон (для удобства)
export const MODAL_IDS = {
  MECHANICS: 'mMechanics',
  CLIENT: 'mClient',
  WHEELS: 'mWheels',
  MATERIALS: 'mMaterials',
  SERVICES: 'mServices',
  SETTINGS: 'mSettings',
  HISTORY: 'mHistory'
};

// ID элементов на главном экране (для обновления)
export const MAIN_SCREEN_IDS = {
  MECHANICS: 'dMechanics',
  CLIENT: 'dClient',
  WHEELS: 'dWheels',
  MATERIALS: 'dMaterials',
  SERVICES: 'dServices',
  TOTAL_SUM: 'btnSaveSum'
};

// Настройки по умолчанию (если нет данных из 1С)
export const DEFAULT_DATA = {
  mechanics: ['Иванов Иван', 'Петров Петр', 'Сидоров Сидор'],
  
  materials: [
    { id: 'mat1', name: 'Грузики 5г', price: 50 },
    { id: 'mat2', name: 'Грузики 10г', price: 70 },
    { id: 'mat3', name: 'Грузики 15г', price: 90 },
    { id: 'mat4', name: 'Золотник', price: 30 },
    { id: 'mat5', name: 'Колпачок', price: 20 },
    { id: 'mat6', name: 'Ремкомплект', price: 150 }
  ],
  
  services: [
    { id: 'svc1', name: '1 Съём/установка колеса R13-16', price: 500 },
    { id: 'svc2', name: '1 Съём/установка колеса R17-19', price: 600 },
    { id: 'svc3', name: '1 Съём/установка колеса R20-22', price: 800 },
    { id: 'svc4', name: '2 Демонтаж/монтаж шины R13-16', price: 800 },
    { id: 'svc5', name: '2 Демонтаж/монтаж шины R17-19', price: 1000 },
    { id: 'svc6', name: '2 Демонтаж/монтаж шины R20-22', price: 1300 },
    { id: 'svc7', name: '3 Балансировка R13-16', price: 400 },
    { id: 'svc8', name: '3 Балансировка R17-19', price: 500 },
    { id: 'svc9', name: '3 Балансировка R20-22', price: 700 },
    { id: 'svc10', name: '4 Ремонт прокола (без демонтажа)', price: 300 },
    { id: 'svc11', name: '4 Ремонт прокола (жгут)', price: 500 },
    { id: 'svc12', name: '5 Ремонт пореза (вулканизация)', price: 1000 },
    { id: 'svc13', name: 'Технологическая мойка', price: 300 },
    { id: 'svc14', name: 'Обработка герметиком', price: 200 },
    { id: 'svc15', name: 'Снятие/установка датчика давления', price: 200 },
    { id: 'svc16', name: 'Утилизация покрышки', price: 100 },
    { id: 'svc17', name: 'Подкачка азотом', price: 300 },
    { id: 'svc18', name: 'Хранение шин (комплект)', price: 500 }
  ]
};

// Временные интервалы для фильтрации истории (в миллисекундах)
export const HISTORY_TIME_RANGES = {
  [HISTORY_FILTERS.TODAY]: 24 * 60 * 60 * 1000,        // 1 день
  [HISTORY_FILTERS.WEEK]: 7 * 24 * 60 * 60 * 1000,     // 7 дней
  [HISTORY_FILTERS.MONTH]: 30 * 24 * 60 * 60 * 1000,   // 30 дней
  [HISTORY_FILTERS.ALL]: Infinity
};

// Цвета для иконок карточек (для консистентности)
export const CARD_COLORS = {
  MECHANICS: 'blue',
  CLIENT: 'orange',
  WHEELS: 'green',
  MATERIALS: 'purple',
  SERVICES: 'red'
};

// Сообщения для тостов и уведомлений
export const MESSAGES = {
  SUCCESS: {
    ORDER_CREATED: 'Заказ успешно создан',
    SETTINGS_LOADED: 'Настройки загружены',
    SETTINGS_SAVED: 'Настройки сохранены',
    RESET_COMPLETE: 'Сброс выполнен',
    APPLY_ALL_COMPLETE: 'Применено ко всем позициям',
    COMPLEX_COMPLETE: 'Комплекс услуг применён'
  },
  ERROR: {
    NO_MECHANICS: 'Выберите хотя бы одного механика',
    NO_CLIENT_DATA: 'Заполните данные клиента',
    NO_SERVICES: 'Выберите хотя бы одну услугу',
    ORDER_FAILED: 'Ошибка при создании заказа',
    LOAD_FAILED: 'Ошибка загрузки данных',
    SAVE_FAILED: 'Ошибка сохранения'
  },
  CONFIRM: {
    RESET: 'Сбросить все данные заказа?',
    CLEAR_HISTORY: 'Очистить всю историю заказов?',
    CANCEL_ORDER: 'Отменить создание заказа?'
  }
};
