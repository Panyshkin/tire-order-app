// src/js/ui/materialsModal.js
// Рендер и обработчики модального окна материалов

import { getState, updateMaterial, getTotalSum } from 
'../state.js';
import { closeModal } from '../utils/modal.js';
import { updateMainScreen } from './mainScreen.js';

/**
 * Рендер списка материалов
 */
export function renderMaterialsModal() {
  const list = document.getElementById('matList');
  if (!list) return;

  const materials = getState().materials;
  const wheelsQty = getState().wheels.qty;

  const html = materials.map(mat => {
    const selectedClass = mat.selected ? 'active' : 'zero';
    return `
      <div class="item-row ${selectedClass}" data-id="${mat.id}">
        <div class="item-name-block">
          <div class="item-name">${mat.name}</div>
          <div class="item-price-label">${mat.price} ₽</div>
        </div>
        <div class="item-controls">
          <div class="item-select-wrap">
            <select class="item-select" data-id="${mat.id}">
              ${Array.from({ length: 21 }, (_, i) => i).map(i => 
                `<option value="${i}" ${mat.qty === i ? 
'selected' : ''}>${i}</option>`
              ).join('')}
            </select>
            <span class="item-select-arrow"><i class="fa-solid 
fa-chevron-down"></i></span>
          </div>
          <div class="item-checkbox-wrap">
            <input type="checkbox" class="item-checkbox" 
data-id="${mat.id}" ${mat.selected ? 'checked' : ''}>
          </div>
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = html;

  // Обновляем сумму в футере
  const footerSum = document.getElementById('matFooterSum');
  if (footerSum) {
    const total = getTotalSum();
    footerSum.innerHTML = `
      <span class="modal-footer-sum-label">Итого:</span>
      <span 
class="modal-footer-sum-value">${total.toLocaleString()} ₽</span>
    `;
  }
}

/**
 * Настройка обработчиков для модалки материалов
 */
export function setupMaterialsModalHandlers() {
  const list = document.getElementById('matList');
  if (!list) return;

  // Обработчики на чекбоксы
  list.querySelectorAll('.item-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const checked = e.target.checked;
      updateMaterial(id, { selected: checked });
      renderMaterialsModal();
      setupMaterialsModalHandlers(); // перевешиваем после перерендера
    });
  });

  // Обработчики на select
  list.querySelectorAll('.item-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const qty = parseInt(e.target.value, 10);
      updateMaterial(id, { qty, selected: qty > 0 });
      renderMaterialsModal();
      setupMaterialsModalHandlers();
    });
  });

  // Кнопка "Готово" в футере
  const doneBtn = document.querySelector('#mMaterials .btn-done');
  if (doneBtn) {
    const newDoneBtn = doneBtn.cloneNode(true);
    doneBtn.parentNode.replaceChild(newDoneBtn, doneBtn);
    newDoneBtn.addEventListener('click', () => {
      closeModal('mMaterials');
      updateMainScreen();
    });
  }
}
