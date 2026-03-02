// src/js/services/index.js
// Логика фильтрации и сортировки услуг

/**
 * Проверяет, является ли услуга постоянной (показывается всегда)
 */
export function isPermanentService(service) {
  return !service.radius && !service.carType && 
!service.lowProfile && !service.runflat;
}

/**
 * Проверяет, подходит ли услуга под параметры колёс
 */
export function serviceMatchesWheels(service, wheels) {
  // Постоянные услуги не фильтруются
  if (isPermanentService(service)) return true;

  // Проверка радиуса
  if (service.radius) {
    if (typeof service.radius === 'number' && service.radius !== 
wheels.radius) return false;
    if (typeof service.radius === 'string') {
      // Диапазон типа "13-16"
      const [min, max] = service.radius.split('-').map(Number);
      if (wheels.radius < min || wheels.radius > max) return 
false;
    }
  }

  // Проверка типа автомобиля
  if (service.carType && service.carType !== wheels.type) return 
false;

  // Проверка специальных флагов
  if (service.lowProfile && !wheels.lowProfile) return false;
  if (service.runflat && !wheels.runflat) return false;

  return true;
}

/**
 * Фильтрует список услуг по параметрам колёс
 */
export function filterServices(services, wheels) {
  return services.filter(s => serviceMatchesWheels(s, wheels));
}

/**
 * Сортирует услуги: сначала с цифровым префиксом 1-5, потом остальные по алфавиту
 */
export function sortServicesByPrefix(services) {
  return [...services].sort((a, b) => {
    const aMatch = a.name.match(/^([1-5])\s/);
    const bMatch = b.name.match(/^([1-5])\s/);

    if (aMatch && bMatch) {
      return parseInt(aMatch[1]) - parseInt(bMatch[1]);
    }
    if (aMatch) return -1;
    if (bMatch) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Применяет комплекс (выбирает услуги с префиксом 1-5)
 */
export function applyComplex(services, wheelsQty) {
  return services.map(s => {
    if (s.name.match(/^[1-5]\s/)) {
      return { ...s, qty: wheelsQty, selected: true };
    } else {
      return { ...s, qty: 0, selected: false };
    }
  });
}
