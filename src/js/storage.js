// src/js/storage.js
// Модуль для работы с данными (localStorage и 1С)

import { STORAGE_KEYS, DEFAULT_DATA, DEFAULT_SUBDIVISION } from './constants.js';
import { showToast } from './utils/toast.js';

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
    // Загружаем механиков
    const savedMechanics = localStorage.getItem(STORAGE_KEYS.MECHANICS);
    mechanics = savedMechanics ? JSON.parse(savedMechanics) : [...DEFAULT_DATA.mechanics];
    
    // Загружаем материалы
    const savedMaterials = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    materials = savedMaterials ? JSON.parse(savedMaterials) : [...DEFAULT_DATA.materials];
    
    // Загружаем услуги
    const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
    services = savedServices ? JSON.parse(savedServices) : [...DEFAULT_DATA.services];
    
    // Загружаем выбранное подразделение
    const savedSubdivision = localStorage.getItem(STORAGE_KEYS.SUBDIVISION);
    currentSubdivision = savedSubdivision || DEFAULT_SUBDIVISION;
    
    console.log('📦 Данные загружены из localStorage:', {
      mechanics: mechanics.length,
      materials: materials.length,
      services: services.length
    });
  } catch (e) {
    console.error('Ошибка загрузки из localStorage:', e);
    // При ошибке используем данные по умолчанию
    mechanics = [...DEFAULT_DATA.mechanics];
    materials = [...DEFAULT_DATA.materials];
    services = [...DEFAULT_DATA.services];
    currentSubdivision = DEFAULT_SUBDIVISION;
  }
}

/**
 * Сохранить данные в localStorage
 */
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

/**
 * Получить данные из 1С (заглушка)
 * @param {string} subdivision - Выбранное подразделение
 */
export async function fetchFrom1C(subdivision = currentSubdivision) {
  try {
    showToast('Загрузка данных из 1С...', 'success');
    
    // TODO: Здесь будет реальный запрос к API
    // const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.GET_SETTINGS}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ subdivision })
    // });
    // const data = await response.json();
    
    // Пока используем данные по умолчанию
    // В реальности данные придут из 1С
    const data = {
      mechanics: [...DEFAULT_DATA.mechanics],
      materials: [...DEFAULT_DATA.materials],
      services: [...DEFAULT_DATA.services]
    };
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Обновляем данные
    mechanics = data.mechanics;
    materials = data.materials;
    services = data.services;
    currentSubdivision = subdivision;
    
    // Сохраняем в localStorage
    saveToStorage();
    
    showToast('Данные загружены успешно', 'success');
    return { success: true };
    
  } catch (error) {
    console.error('Ошибка загрузки из 1С:', error);
    showToast('Ошибка загрузки из 1С', 'error');
    return { success: false, error };
  }
}

/**
 * Сбросить к заводским настройкам
 */
export function resetToDefaults() {
  mechanics = [...DEFAULT_DATA.mechanics];
  materials = [...DEFAULT_DATA.materials];
  services = [...DEFAULT_DATA.services];
  currentSubdivision = DEFAULT_SUBDIVISION;
  
  saveToStorage();
  showToast('Сброшено к заводским настройкам', 'success');
}

// ======== ГЕТТЕРЫ (только для чтения) ========

/**
 * Получить список механиков
 * @returns {Array} Массив строк с именами механиков
 */
export function getMechanics() {
  return [...mechanics];
}

/**
 * Получить список материалов
 * @returns {Array} Массив объектов материалов { id, name, price }
 */
export function getMaterials() {
  return materials.map(m => ({ ...m }));
}

/**
 * Получить список услуг
 * @returns {Array} Массив объектов услуг { id, name, price, radius, carType, lowProfile, runflat }
 */
export function getServices() {
  return services.map(s => ({ ...s }));
}

/**
 * Получить текущее подразделение
 * @returns {string} Название подразделения
 */
export function getCurrentSubdivision() {
  return currentSubdivision;
}

// ======== СЕТТЕРЫ (для настроек) ========

/**
 * Обновить список механиков
 * @param {Array} newMechanics - Новый массив механиков
 */
export function updateMechanics(newMechanics) {
  mechanics = [...newMechanics];
  saveToStorage();
}

/**
 * Обновить список материалов
 * @param {Array} newMaterials - Новый массив материалов
 */
export function updateMaterials(newMaterials) {
  materials = newMaterials.map(m => ({ ...m }));
  saveToStorage();
}

/**
 * Обновить список услуг
 * @param {Array} newServices - Новый массив услуг
 */
export function updateServices(newServices) {
  services = newServices.map(s => ({ ...s }));
  saveToStorage();
}

/**
 * Установить текущее подразделение
 * @param {string} subdivision - Название подразделения
 */
export function setCurrentSubdivision(subdivision) {
  currentSubdivision = subdivision;
  saveToStorage();
}

// ======== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ========

/**
 * Получить материал по ID
 * @param {string} id - ID материала
 * @returns {Object|null} Объект материала или null
 */
export function getMaterialById(id) {
  return materials.find(m => m.id === id) || null;
}

/**
 * Получить услугу по ID
 * @param {string} id - ID услуги
 * @returns {Object|null} Объект услуги или null
 */
export function getServiceById(id) {
  return services.find(s => s.id === id) || null;
}

/**
 * Проверить, есть ли данные в хранилище
 * @returns {boolean} true если есть хотя бы механики
 */
export function hasData() {
  return mechanics.length > 0;
}

/**
 * Получить статистику по данным
 * @returns {Object} Объект с количеством записей
 */
export function getDataStats() {
  return {
    mechanics: mechanics.length,
    materials: materials.length,
    services: services.length,
    subdivision: currentSubdivision
  };
}
