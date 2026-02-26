// src/js/utils/toast.js
// Утилита для показа всплывающих уведомлений

let toastTimeout = null;

/**
 * Показать всплывающее уведомление
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип: 'success' или 'error'
 * @param {number} duration - Длительность показа в мс
 */
export function showToast(message, type = 'success', duration = 3000) {
  // Получаем элементы тоста
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  
  // Если элементы не найдены, выходим
  if (!toast || !toastMsg) {
    console.warn('Элементы тоста не найдены');
    return;
  }
  
  // Очищаем предыдущий таймер
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
  
  // Устанавливаем иконку в зависимости от типа
  const icon = toast.querySelector('i');
  if (icon) {
    icon.className = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : 'fa-solid fa-circle-exclamation';
  }
  
  // Устанавливаем текст и показываем тост
  toastMsg.textContent = message;
  toast.classList.add('show');
  
  // Устанавливаем таймер на скрытие
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toastTimeout = null;
  }, duration);
}

/**
 * Скрыть тост принудительно
 */
export function hideToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.remove('show');
  }
  
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
}

/**
 * Показать сообщение об ошибке
 * @param {string} message - Текст ошибки
 */
export function showError(message) {
  showToast(message, 'error', 4000);
}

/**
 * Показать сообщение об успехе
 * @param {string} message - Текст сообщения
 */
export function showSuccess(message) {
  showToast(message, 'success', 3000);
}
