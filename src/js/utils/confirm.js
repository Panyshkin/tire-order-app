// src/js/utils/confirm.js
// Утилита для диалогов подтверждения

let confirmResolve = null;

/**
 * Показать диалог подтверждения
 * @param {string} title - Заголовок
 * @param {string} text - Текст сообщения
 * @returns {Promise<boolean>} - true если OK, false если Отмена
 */
export function showConfirm(title, text) {
  const overlay = document.getElementById('confirmOverlay');
  const titleEl = document.getElementById('confirmTitle');
  const textEl = document.getElementById('confirmText');
  
  if (!overlay || !titleEl || !textEl) {
    console.warn('Элементы подтверждения не найдены');
    return Promise.resolve(false);
  }
  
  titleEl.textContent = title;
  textEl.textContent = text;
  
  overlay.classList.add('active');
  
  return new Promise((resolve) => {
    confirmResolve = resolve;
  });
}

/**
 * Скрыть диалог подтверждения
 */
export function hideConfirm() {
  const overlay = document.getElementById('confirmOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  confirmResolve = null;
}

/**
 * Настроить обработчики для кнопок подтверждения
 * (вызывается в main.js при инициализации)
 */
export function setupConfirmHandlers() {
  const overlay = document.getElementById('confirmOverlay');
  const okBtn = document.getElementById('confirmOk');
  const cancelBtn = document.getElementById('confirmCancel');
  
  if (!overlay || !okBtn || !cancelBtn) {
    console.warn('Элементы подтверждения не найдены');
    return;
  }
  
  // Кнопка OK
  okBtn.addEventListener('click', () => {
    if (confirmResolve) confirmResolve(true);
    hideConfirm();
  });
  
  // Кнопка Отмена
  cancelBtn.addEventListener('click', () => {
    if (confirmResolve) confirmResolve(false);
    hideConfirm();
  });
  
  // Клик по оверлею (вне диалога) = Отмена
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (confirmResolve) confirmResolve(false);
      hideConfirm();
    }
  });
  
  // Обработка клавиши Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      if (confirmResolve) confirmResolve(false);
      hideConfirm();
    }
  });
}

/**
 * Упрощённые функции для частых случаев
 */
export async function confirmReset() {
  return showConfirm('Сброс', 'Сбросить все данные заказа?');
}

export async function confirmClearHistory() {
  return showConfirm('Очистка истории', 'Очистить всю историю заказов?');
}

export async function confirmCancelOrder() {
  return showConfirm('Отмена', 'Отменить создание заказа?');
}
