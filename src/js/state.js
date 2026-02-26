// src/js/state.js
// Состояние текущего заказа

import { getMechanics, getMaterials, getServices } from './storage.js';
import { WHEELS } from './constants.js';

// Состояние заказа
let state = {
  mechanics: [],           // выбранные механики
  client: {
    name: '',
    phone: '',
    car: ''
  },
  wheels: {
    radius: WHEELS.DEFAULT_RADIUS,
    type: WHEELS.DEFAULT_TYPE,
    lowProfile: WHEELS.DEFAULT_LOW_PROFILE,
    runflat: WHEELS.DEFAULT_RUNFLAT,
    qty: WHEELS.DEFAULT_QTY
  },
  materials: [],           // материалы с qty и selected
  services: []             // услуги с qty и selected
};

// Подписчики на изменения состояния
const subscribers = [];

/**
 * Подписаться на изменения состояния
 * @param {Function} callback - Функция, которая будет вызвана при изменении
 * @returns {Function} Функция для отписки
 */
export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) subscribers.splice(index, 1);
  };
}

/**
 * Уведомить всех подписчиков об изменении
 */
function notifySubscribers() {
  subscribers.forEach(callback => {
    try {
      callback(state);
    } catch (e) {
      console.error('Ошибка в подписчике:', e);
    }
  });
}

/**
 * Инициализировать состояние из справочников
 */
export function initState() {
  // Получаем данные из хранилища
  const materials = getMaterials().map(m => ({
    ...m,
    qty: 0,
    selected: false
  }));
  
  const services = getServices().map(s => ({
    ...s,
    qty: 0,
    selected: false
  }));
  
  // Устанавливаем начальное состояние
  state = {
    mechanics: [],
    client: { name: '', phone: '', car: '' },
    wheels: {
      radius: WHEELS.DEFAULT_RADIUS,
      type: WHEELS.DEFAULT_TYPE,
      lowProfile: WHEELS.DEFAULT_LOW_PROFILE,
      runflat: WHEELS.DEFAULT_RUNFLAT,
      qty: WHEELS.DEFAULT_QTY
    },
    materials,
    services
  };
  
  notifySubscribers();
  console.log('🔄 Состояние инициализировано');
}

/**
 * Получить копию текущего состояния
 * @returns {Object} Копия состояния
 */
export function getState() {
  return {
    ...state,
    materials: state.materials.map(m => ({ ...m })),
    services: state.services.map(s => ({ ...s }))
  };
}

/**
 * Обновить состояние полностью
 * @param {Object} newState - Новое состояние
 */
export function setState(newState) {
  state = { ...newState };
  notifySubscribers();
}

/**
 * Частичное обновление состояния
 * @param {Object} patch - Объект с изменениями
 */
export function patchState(patch) {
  state = { ...state, ...patch };
  notifySubscribers();
}

// ======== ОБНОВЛЕНИЕ МЕХАНИКОВ ========

/**
 * Установить выбранных механиков
 * @param {Array} mechanics - Массив имен механиков
 */
export function setMechanics(mechanics) {
  state.mechanics = [...mechanics];
  notifySubscribers();
}

/**
 * Добавить механика
 * @param {string} mechanic - Имя механика
 */
export function addMechanic(mechanic) {
  if (!state.mechanics.includes(mechanic)) {
    state.mechanics.push(mechanic);
    notifySubscribers();
  }
}

/**
 * Удалить механика
 * @param {string} mechanic - Имя механика
 */
export function removeMechanic(mechanic) {
  state.mechanics = state.mechanics.filter(m => m !== mechanic);
  notifySubscribers();
}

// ======== ОБНОВЛЕНИЕ КЛИЕНТА ========

/**
 * Установить данные клиента
 * @param {Object} clientData - { name, phone, car }
 */
export function setClient(clientData) {
  state.client = { ...state.client, ...clientData };
  notifySubscribers();
}

/**
 * Обновить поле клиента
 * @param {string} field - 'name', 'phone' или 'car'
 * @param {string} value - Новое значение
 */
export function updateClientField(field, value) {
  if (field in state.client) {
    state.client[field] = value;
    notifySubscribers();
  }
}

// ======== ОБНОВЛЕНИЕ ПАРАМЕТРОВ КОЛЁС ========

/**
 * Установить параметры колёс
 * @param {Object} wheelsData - { radius, type, lowProfile, runflat, qty }
 */
export function setWheels(wheelsData) {
  state.wheels = { ...state.wheels, ...wheelsData };
  notifySubscribers();
}

/**
 * Установить радиус
 * @param {number} radius - Радиус от 13 до 24
 */
export function setWheelRadius(radius) {
  if (WHEELS.RADII.includes(radius)) {
    state.wheels.radius = radius;
    notifySubscribers();
  }
}

/**
 * Установить тип
 * @param {string} type - 'light' или 'jeep'
 */
export function setWheelType(type) {
  if (type === 'light' || type === 'jeep' || type === null) {
    state.wheels.type = type;
    notifySubscribers();
  }
}

/**
 * Установить флаг низкого профиля
 * @param {boolean} value
 */
export function setLowProfile(value) {
  state.wheels.lowProfile = value;
  notifySubscribers();
}

/**
 * Установить флаг RunFlat
 * @param {boolean} value
 */
export function setRunflat(value) {
  state.wheels.runflat = value;
  notifySubscribers();
}

/**
 * Установить количество колёс
 * @param {number} qty - От 1 до 20
 */
export function setWheelQty(qty) {
  if (qty >= WHEELS.MIN_QTY && qty <= WHEELS.MAX_QTY) {
    state.wheels.qty = qty;
    notifySubscribers();
  }
}

/**
 * Увеличить количество колёс на 1
 */
export function incrementWheelQty() {
  if (state.wheels.qty < WHEELS.MAX_QTY) {
    state.wheels.qty++;
    notifySubscribers();
  }
}

/**
 * Уменьшить количество колёс на 1
 */
export function decrementWheelQty() {
  if (state.wheels.qty > WHEELS.MIN_QTY) {
    state.wheels.qty--;
    notifySubscribers();
  }
}

// ======== ОБНОВЛЕНИЕ МАТЕРИАЛОВ ========

/**
 * Обновить конкретный материал
 * @param {string} id - ID материала
 * @param {Object} updates - { qty, selected }
 */
export function updateMaterial(id, updates) {
  const index = state.materials.findIndex(m => m.id === id);
  if (index !== -1) {
    state.materials[index] = { ...state.materials[index], ...updates };
    notifySubscribers();
  }
}

/**
 * Установить количество материала
 * @param {string} id - ID материала
 * @param {number} qty - Количество
 */
export function setMaterialQty(id, qty) {
  const index = state.materials.findIndex(m => m.id === id);
  if (index !== -1) {
    state.materials[index].qty = qty;
    state.materials[index].selected = qty > 0;
    notifySubscribers();
  }
}

/**
 * Установить выбранность материала
 * @param {string} id - ID материала
 * @param {boolean} selected - Выбран или нет
 */
export function setMaterialSelected(id, selected) {
  const index = state.materials.findIndex(m => m.id === id);
  if (index !== -1) {
    state.materials[index].selected = selected;
    if (selected && state.materials[index].qty === 0) {
      state.materials[index].qty = state.wheels.qty;
    } else if (!selected) {
      state.materials[index].qty = 0;
    }
    notifySubscribers();
  }
}

// ======== ОБНОВЛЕНИЕ УСЛУГ ========

/**
 * Обновить конкретную услугу
 * @param {string} id - ID услуги
 * @param {Object} updates - { qty, selected }
 */
export function updateService(id, updates) {
  const index = state.services.findIndex(s => s.id === id);
  if (index !== -1) {
    state.services[index] = { ...state.services[index], ...updates };
    notifySubscribers();
  }
}

/**
 * Установить количество услуги
 * @param {string} id - ID услуги
 * @param {number} qty - Количество
 */
export function setServiceQty(id, qty) {
  const index = state.services.findIndex(s => s.id === id);
  if (index !== -1) {
    state.services[index].qty = qty;
    state.services[index].selected = qty > 0;
    notifySubscribers();
  }
}

/**
 * Установить выбранность услуги
 * @param {string} id - ID услуги
 * @param {boolean} selected - Выбрана или нет
 */
export function setServiceSelected(id, selected) {
  const index = state.services.findIndex(s => s.id === id);
  if (index !== -1) {
    state.services[index].selected = selected;
    if (selected && state.services[index].qty === 0) {
      state.services[index].qty = state.wheels.qty;
    } else if (!selected) {
      state.services[index].qty = 0;
    }
    notifySubscribers();
  }
}

// ======== СБРОС ========

/**
 * Сбросить заказ
 * @param {boolean} keepClientAndMechanics - Оставить ли данные клиента и механиков
 */
export function resetOrder(keepClientAndMechanics = true) {
  const materials = getMaterials().map(m => ({
    ...m,
    qty: 0,
    selected: false
  }));
  
  const services = getServices().map(s => ({
    ...s,
    qty: 0,
    selected: false
  }));
  
  if (keepClientAndMechanics) {
    state = {
      ...state,
      materials,
      services,
      wheels: {
        radius: WHEELS.DEFAULT_RADIUS,
        type: WHEELS.DEFAULT_TYPE,
        lowProfile: WHEELS.DEFAULT_LOW_PROFILE,
        runflat: WHEELS.DEFAULT_RUNFLAT,
        qty: WHEELS.DEFAULT_QTY
      }
    };
  } else {
    state = {
      mechanics: [],
      client: { name: '', phone: '', car: '' },
      wheels: {
        radius: WHEELS.DEFAULT_RADIUS,
        type: WHEELS.DEFAULT_TYPE,
        lowProfile: WHEELS.DEFAULT_LOW_PROFILE,
        runflat: WHEELS.DEFAULT_RUNFLAT,
        qty: WHEELS.DEFAULT_QTY
      },
      materials,
      services
    };
  }
  
  notifySubscribers();
}

// ======== ПОДСЧЁТ СУММ ========

/**
 * Получить общую сумму заказа
 * @returns {number} Общая сумма
 */
export function getTotalSum() {
  const materialsSum = state.materials
    .filter(m => m.selected && m.qty > 0)
    .reduce((sum, m) => sum + (m.price * m.qty), 0);
  
  const servicesSum = state.services
    .filter(s => s.selected && s.qty > 0)
    .reduce((sum, s) => sum + (s.price * s.qty), 0);
  
  return materialsSum + servicesSum;
}

/**
 * Получить количество выбранных позиций
 * @returns {Object} { materials: number, services: number }
 */
export function getSelectedCounts() {
  const materials = state.materials.filter(m => m.selected).length;
  const services = state.services.filter(s => s.selected).length;
  return { materials, services };
}

/**
 * Проверить, заполнены ли обязательные поля
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateOrder() {
  const errors = [];
  
  if (state.mechanics.length === 0) {
    errors.push('Выберите хотя бы одного механика');
  }
  
  if (!state.client.name.trim()) {
    errors.push('Введите ФИО клиента');
  }
  
  if (!state.client.phone.trim()) {
    errors.push('Введите телефон клиента');
  }
  
  if (!state.client.car.trim()) {
    errors.push('Введите автомобиль');
  }
  
  const hasServices = state.services.some(s => s.selected);
  if (!hasServices) {
    errors.push('Выберите хотя бы одну услугу');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
