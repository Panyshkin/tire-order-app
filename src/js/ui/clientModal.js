// src/js/ui/clientModal.js
// Рендер и обработчики модального окна клиента

import { getState, setClient } from '../state.js';
import { closeModal } from '../utils/modal.js';
import { updateMainScreen } from './mainScreen.js';

/**
 * Рендер модалки клиента (заполнение полей текущими данными)
 */
export function renderClientModal() {
  const state = getState();
  const client = state.client;

  const nameInput = document.getElementById('inName');
  const phoneInput = document.getElementById('inPhone');
  const carInput = document.getElementById('inCar');

  if (nameInput) nameInput.value = client.name || '';
  if (phoneInput) phoneInput.value = client.phone || '';
  if (carInput) carInput.value = client.car || '';
}

/**
 * Настройка обработчиков для модалки клиента
 */
export function setupClientModalHandlers() {
  // Кнопка "Готово" в футере
  const doneBtn = document.querySelector('#mClient .modal-footer .btn-done');
  if (doneBtn) {
    // Убираем старые обработчики через клонирование
    const newDoneBtn = doneBtn.cloneNode(true);
    doneBtn.parentNode.replaceChild(newDoneBtn, doneBtn);
    newDoneBtn.addEventListener('click', () => {
      const name = document.getElementById('inName').value;
      const phone = document.getElementById('inPhone').value;
      const car = document.getElementById('inCar').value;
      setClient({ name, phone, car });
      closeModal('mClient');
      updateMainScreen();
    });
  }

  // Кнопка сканирования (пока заглушка)
  const scanBtn = document.getElementById('btnScanPlate');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      console.log('Сканирование номера (заглушка)');
    });
  }
}
