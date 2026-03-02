// src/js/services/filters.js
// Функции для фильтрации услуг по параметрам колёс

/**
 * Проверка, подходит ли услуга под текущие параметры колёс
 * @param {Object} service - Объект услуги { radius, carType, lowProfile, runflat, ... }
 * @param {Object} wheels - Параметры колёс { radius, type, lowProfile, runflat }
 * @returns {boolean}
 */
export function serviceMatchesWheels(service, wheels) {
  // Постоянные услуги (все поля параметров пусты) показываем всегда
  const isPermanent = !service.radius && !service.carType && !service.lowProfile && !service.runflat;
  if (isPermanent) return true;

  // Проверка радиуса
  if (service.radius) {
    // Если радиус задан числом
    if (typeof service.radius === 'number' && service.radius !== wheels.radius) return false;
    // Если радиус задан строкой диапазона, например "13-16"
    if (typeof service.radius === 'string') {
      const [min, max] = service.radius.split('-').map(Number);
      if (wheels.radius < min || wheels.radius > max) return false;
    }
  }

  // Проверка типа автомобиля
  if (service.carType && service.carType !== wheels.type) return false;

  // Проверка low profile
  if (service.lowProfile && !wheels.lowProfile) return false;

  // Проверка runflat
  if (service.runflat && !wheels.runflat) return false;

  return true;
}

/**
 * Фильтрация списка услуг по параметрам колёс
 * @param {Array} services - Полный список услуг
 * @param {Object} wheels - Параметры колёс
 * @returns {Array} Отфильтрованный список
 */
export function filterServices(services, wheels) {
  return services.filter(service => serviceMatchesWheels(service, 
wheels));
}

/**
 * Сортировка услуг: сначала с префиксом 1-5, затем остальные по 
алфавиту
 * @param {Array} services - Список услуг
 * @returns {Array} Отсортированный список
 */
export function sortServicesByPrefix(services) {
  return [...services].sort((a, b) => {
    const aMatch = a.name.match(/^([1-5])\s/);
    const bMatch = b.name.match(/^([1-5])\s/);

    if (aMatch && bMatch) return parseInt(aMatch[1]) - 
parseInt(bMatch[1]);
    if (aMatch) return -1;
    if (bMatch) return 1;
    return a.name.localeCompare(b.name);
  });
}
