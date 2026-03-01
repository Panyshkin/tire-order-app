// src/js/ui/mechanicsModal.js
// Рендер и обработчики модального окна механиков

import { getMechanics } from '../storage.js';
import { getState, setMechanics } from '../state.js';
import { closeModal } from '../utils/modal.js';
import { updateMainScreen } from './mainScreen.js';

/**
 * Рендер списка механиков
 */
export function renderMechanicsModal() {
  const list = document.getElementById('mechList');
  if (!list) return;

  const allMechanics = getMechanics();
  const selectedMechanics = getState().mechanics;

  const html = allMechanics.map(mechanic => {
    const isSelected = selectedMechanics.includes(mechanic);
    return `
      <div class="mech-item ${isSelected ? 'selected' : ''}" data-mechanic="${mechanic}">
        <span class="mech-check">${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}</span>
        <span class="mech-name">${mechanic}</span>
      </div>
    `;
  }).join('');

  list.innerHTML = html;
}

/**
 * Настройка обработчиков для модалки механиков
 */
export function setupMechanicsModalHandlers() {
  const list = document.getElementById('mechList');
  if (!list) return;

  list.querySelectorAll('.mech-item').forEach(item => {
    item.addEventListener('click', () => {
      const mechanic = item.dataset.mechanic;
      const currentSelected = [...getState().mechanics];
      const index = currentSelected.indexOf(mechanic);

      if (index === -1) {
        currentSelected.push(mechanic);
      } else {
        currentSelected.splice(index, 1);
      }

      setMechanics(currentSelected);
      renderMechanicsModal();
      setupMechanicsModalHandlers();
    });
  });

  const doneBtn = document.querySelector('#mMechanics .btn-done');
  if (doneBtn) {
    const newDoneBtn = doneBtn.cloneNode(true);
    doneBtn.parentNode.replaceChild(newDoneBtn, doneBtn);
    newDoneBtn.addEventListener('click', () => {
      closeModal('mMechanics');
      updateMainScreen();
    });
  }
}
