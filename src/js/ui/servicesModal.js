// src/js/ui/servicesModal.js
// Рендер и обработчики модального окна услуг

import { getState, updateService, getTotalSum } from '../state.js';
import { filterServices, sortServicesByPrefix } from '../services/filters.js';
import { closeModal } from '../utils/modal.js';
import { updateMainScreen } from './mainScreen.js';
import { showToast } from '../utils/toast.js';

/**
 * Рендер списка услуг
 */
export function renderServicesModal() {
  const list = document.getElementById('svcList');
  if (!list) return;

  const state = getState();
  const filtered = filterServices(state.services, state.wheels);
  const sorted = sortServicesByPrefix(filtered);

  const html = sorted.map(svc => {
    const selectedClass = svc.selected ? 'active' : 'zero';
    return `
      <div class="item-row ${selectedClass}" data-id="${svc.id}">
        <div class="item-name-block">
          <div class="item-name">${svc.name}</div>
          <div class="item-price-label">${svc.price} ₽</div>
        </div>
        <div class="item-controls">
          <div class="item-select-wrap">
            <select class="item-select" data-id="${svc.id}">
              ${Array.from({ length: 21 }, (_, i) => i).map(i =>
                `<option value="${i}" ${svc.qty === i ? 'selected' : ''}>${i}</option>`
              ).join('')}
            </select>
            <span class="item-select-arrow"><i class="fa-solid fa-chevron-down"></i></span>
          </div>
          <div class="item-checkbox-wrap">
            <input type="checkbox" class="item-checkbox" data-id="${svc.id}" ${svc.selected ? 'checked' : ''}>
          </div>
        </div>
      </div>
    `;
  }).join('') || '<div class="empty-state">Нет услуг для выбранных параметров</div>';

  list.innerHTML = html;

  // Обновляем сумму в футере
  const footerSum = document.getElementById('svcFooterSum');
  if (footerSum) {
    const total = getTotalSum();
    footerSum.innerHTML = `
      <span class="modal-footer-sum-label">Итого:</span>
      <span class="modal-footer-sum-value">${total.toLocaleString()} ₽</span>
    `;
  }
}

/**
 * Обработчик кнопки "Комплекс" (звёздочка)
 */
export function handleComplex() {
  const state = getState();
  const filtered = filterServices(state.services, state.wheels);

  // Сбрасываем все услуги
  state.services = state.services.map(s => ({
    ...s,
    selected: false,
    qty: 0
  }));

  // Отмечаем услуги с префиксом 1-5 в отфильтрованном списке
  let count = 0;
  filtered.forEach(svc => {
    if (svc.name.match(/^[1-5]\s/)) {
      const idx = state.services.findIndex(s => s.id === svc.id);
      if (idx !== -1) {
        state.services[idx].selected = true;
        state.services[idx].qty = state.wheels.qty;
        count++;
      }
    }
  });

  // Обновляем состояние и интерфейс
  import('../state.js').then(({ setState }) => {
    setState(state);
    renderServicesModal();
    setupServicesModalHandlers(); // перевешиваем обработчики
    updateMainScreen();
    showToast(`Комплекс: ${count} услуг выбрано`, 'success');
  });
}

/**
 * Настройка обработчиков для модалки услуг
 */
export function setupServicesModalHandlers() {
  const list = document.getElementById('svcList');
  if (!list) return;

  // Обработчики на чекбоксы
  list.querySelectorAll('.item-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const checked = e.target.checked;
      updateService(id, { selected: checked });
      renderServicesModal();
      setupServicesModalHandlers();
    });
  });

  // Обработчики на select
  list.querySelectorAll('.item-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const qty = parseInt(e.target.value, 10);
      updateService(id, { qty, selected: qty > 0 });
      renderServicesModal();
      setupServicesModalHandlers();
    });
  });

  // Кнопка "Комплекс" (звёздочка)
  const complexBtn = document.getElementById('btnComplexServices');
  if (complexBtn) {
    // Удаляем старые обработчики, клонируя кнопку
    const newComplexBtn = complexBtn.cloneNode(true);
    complexBtn.parentNode.replaceChild(newComplexBtn, complexBtn);
    newComplexBtn.addEventListener('click', handleComplex);
  }

  // Кнопка "Готово" в футере
  const doneBtn = document.querySelector('#mServices .btn-done');
  if (doneBtn) {
    const newDoneBtn = doneBtn.cloneNode(true);
    doneBtn.parentNode.replaceChild(newDoneBtn, doneBtn);
    newDoneBtn.addEventListener('click', () => {
      closeModal('mServices');
      updateMainScreen();
    });
  }
}
