// src/js/utils/modal.js
// Утилита для управления модальными окнами

// Хранилище зарегистрированных модалок
const modals = {};

/**
 * Зарегистрировать модальное окно
 * @param {string} modalId - ID модального окна
 * @param {Object} options - Опции { onOpen, onClose }
 */
export function registerModal(modalId, options = {}) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.warn(`Модальное окно с id "${modalId}" не найдено`);
    return;
  }
  
  modals[modalId] = {
    element: modal,
    onOpen: options.onOpen || null,
    onClose: options.onClose || null
  };
  
  // Закрытие по клику на оверлей
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  // Закрытие по кнопке закрытия
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modalId));
  }
  
  // Закрытие свайпом вниз
  const handle = modal.querySelector('.modal-handle');
  if (handle) {
    let startY = 0;
    
    handle.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });
    
    handle.addEventListener('touchend', (e) => {
      const endY = e.changedTouches[0].clientY;
      if (endY - startY > 50) { // Свайп вниз больше 50px
        closeModal(modalId);
      }
    });
  }
  
  console.log(`Модальное окно "${modalId}" зарегистрировано`);
}

/**
 * Открыть модальное окно
 * @param {string} modalId - ID модального окна
 */
export function openModal(modalId) {
  const modal = modals[modalId];
  if (!modal) {
    console.warn(`Модальное окно "${modalId}" не зарегистрировано`);
    return;
  }
  
  modal.element.classList.add('active');
  document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
  
  if (modal.onOpen) {
    modal.onOpen();
  }
}

/**
 * Закрыть модальное окно
 * @param {string} modalId - ID модального окна
 */
export function closeModal(modalId) {
  const modal = modals[modalId];
  if (!modal) {
    console.warn(`Модальное окно "${modalId}" не зарегистрировано`);
    return;
  }
  
  modal.element.classList.remove('active');
  document.body.style.overflow = ''; // Возвращаем прокрутку
  
  if (modal.onClose) {
    modal.onClose();
  }
}

/**
 * Закрыть все модальные окна
 */
export function closeAllModals() {
  Object.keys(modals).forEach(modalId => {
    closeModal(modalId);
  });
}

/**
 * Проверить, открыто ли модальное окно
 * @param {string} modalId - ID модального окна
 * @returns {boolean}
 */
export function isModalOpen(modalId) {
  const modal = modals[modalId];
  return modal ? modal.element.classList.contains('active') : false;
}

/**
 * Получить список всех открытых модалок
 * @returns {Array} Массив ID открытых модалок
 */
export function getOpenModals() {
  return Object.keys(modals).filter(modalId => 
    modals[modalId].element.classList.contains('active')
  );
}
