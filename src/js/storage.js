// src/js/storage.js
// Модуль для работы с данными (localStorage и 1С)

//import { STORAGE_KEYS, DEFAULT_SUBDIVISION } from 
'./constants.js';
import { showToast } from './utils/toast.js';
import { STORAGE_KEYS, DEFAULT_SUBDIVISION, API } from 
'./constants.js';
// Внутренние данные (неизменяемые справочники)
let mechanics = [];
let materials = [];
let services = [];
let currentSubdivision = DEFAULT_SUBDIVISION;

/**
 * Загрузить данные из localStorage
 */
export function loadFromStorage() {
  try {
    const savedMechanics = localStorage.getItem(STORAGE_KEYS.MECHANICS);
    mechanics = savedMechanics ? JSON.parse(savedMechanics) : [];

    const savedMaterials = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    materials = savedMaterials ? JSON.parse(savedMaterials) : [];

    const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
    services = savedServices ? JSON.parse(savedServices) : [];

    const savedSubdivision = localStorage.getItem(STORAGE_KEYS.SUBDIVISION);
    currentSubdivision = savedSubdivision || DEFAULT_SUBDIVISION;

    console.log('📦 Данные загружены из localStorage:', {
      mechanics: mechanics.length,
      materials: materials.length,
      services: services.length
    });
  } catch (e) {
    console.error('Ошибка загрузки из localStorage:', e);
    mechanics = [];
    materials = [];
    services = [];
    currentSubdivision = DEFAULT_SUBDIVISION;
  }
}

export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(mechanics));
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    localStorage.setItem(STORAGE_KEYS.SUBDIVISION, currentSubdivision);

    console.log('💾 Данные сохранены в localStorage');
  } catch (e) {
    console.error('Ошибка сохранения в localStorage:', e);
    showToast('Ошибка сохранения данных', 'error');
  }
}

export async function fetchFrom1C(subdivision = currentSubdivision) 
{
  try {
    showToast('Загрузка данных из 1С...', 'success');

    const response = await 
fetch(`${API.BASE_URL}${API.ENDPOINTS.GET_SETTINGS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subdivision })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    // Ожидаем, что в ответе есть поля mechanics, materials, 
services
    // Если их нет, подставляем пустые массивы
    mechanics = data.mechanics || [];
    materials = data.materials || [];
    services = data.services || [];
    currentSubdivision = subdivision;

    saveToStorage();
    showToast('Данные загружены успешно', 'success');
    return { success: true };

  } catch (error) {
    console.error('Ошибка загрузки из 1С:', error);
    showToast('Ошибка загрузки из 1С', 'error');
    return { success: false, error };
  }
}

export function resetToDefaults() {
  mechanics = [];
  materials = [];
  services = [];
  currentSubdivision = DEFAULT_SUBDIVISION;

  saveToStorage();
  showToast('Все данные очищены', 'success');
}

export function getMechanics() {
  return [...mechanics];
}

export function getMaterials() {
  return materials.map(m => ({ ...m }));
}

export function getServices() {
  return services.map(s => ({ ...s }));
}

export function getCurrentSubdivision() {
  return currentSubdivision;
}

export function updateMechanics(newMechanics) {
  mechanics = [...newMechanics];
  saveToStorage();
}

export function updateMaterials(newMaterials) {
  materials = newMaterials.map(m => ({ ...m }));
  saveToStorage();
}

export function updateServices(newServices) {
  services = newServices.map(s => ({ ...s }));
  saveToStorage();
}

export function setCurrentSubdivision(subdivision) {
  currentSubdivision = subdivision;
  saveToStorage();
}

export function getMaterialById(id) {
  return materials.find(m => m.id === id) || null;
}

export function getServiceById(id) {
  return services.find(s => s.id === id) || null;
}

export function hasData() {
  return mechanics.length > 0 || materials.length > 0 || services.length > 0;
}

export function getDataStats() {
  return {
    mechanics: mechanics.length,
    materials: materials.length,
    services: services.length,
    subdivision: currentSubdivision
  };
}

// ======== ИСТОРИЯ ЗАКАЗОВ ========

const ORDERS_KEY = 'tireShop_orders';

/**
 * Сохранить заказ в историю
 * @param {Object} order - Объект заказа с номером и датой
 */
export function saveOrderToHistory(order) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) 
|| [];
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    console.log('📜 Заказ сохранён в историю');
  } catch (e) {
    console.error('Ошибка сохранения истории:', e);
  }
}

/**
 * Получить всю историю заказов
 * @returns {Array} Массив заказов
 */
export function getOrdersHistory() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (e) {
    console.error('Ошибка чтения истории:', e);
    return [];
  }
}

/**
 * Очистить историю заказов
 */
export function clearOrdersHistory() {
  try {
    localStorage.removeItem(ORDERS_KEY);
    console.log('🗑️ История очищена');
  } catch (e) {
    console.error('Ошибка очистки истории:', e);
  }
}
