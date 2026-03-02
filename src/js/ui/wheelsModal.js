// src/js/ui/wheelsModal.js
// Рендер модального окна параметров колёс

import { WHEELS } from '../constants.js';
import { getState, setWheelRadius, setWheelType, setLowProfile, setRunflat, incrementWheelQty, decrementWheelQty, applyWheelsToAll } from '../state.js';
import { closeModal } from '../utils/modal.js';
import { updateMainScreen } from './mainScreen.js';

export function renderRadiusGrid(currentRadius) {
  const grid = document.getElementById('radiusGrid');
  if (!grid) return;

  const radii = WHEELS.RADII;
  let html = '';

  for (let i = 0; i < radii.length; i += 4) {
    html += '<div style="display: contents;">';
    for (let j = 0; j < 4; j++) {
      const radius = radii[i + j];
      if (radius) {
        const activeClass = radius === currentRadius ? 'active' : '';
        html += `<button class="radius-btn ${activeClass}" data-radius="${radius}">${radius}</button>`;
      } else {
        html += '<div></div>';
      }
    }
    html += '</div>';
  }

  grid.innerHTML = html;

  grid.querySelectorAll('.radius-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const radius = parseInt(btn.dataset.radius);
      setWheelRadius(radius);
      renderWheelsModal();
    });
  });
}

export function renderTypeButtons(wheels) {
  const typeGrid = document.getElementById('typeGrid');
  if (!typeGrid) return;

  const lightBtn = typeGrid.querySelector('[data-type="light"]');
  if (lightBtn) {
    if (wheels.type === 'light') lightBtn.classList.add('active');
    else lightBtn.classList.remove('active');
  }

  const jeepBtn = typeGrid.querySelector('[data-type="jeep"]');
  if (jeepBtn) {
    if (wheels.type === 'jeep') jeepBtn.classList.add('active');
    else jeepBtn.classList.remove('active');
  }

  const lowProfileBtn = typeGrid.querySelector('[data-type="lowProfile"]');
  if (lowProfileBtn) {
    if (wheels.lowProfile) lowProfileBtn.classList.add('active');
    else lowProfileBtn.classList.remove('active');
  }

  const runflatBtn = typeGrid.querySelector('[data-type="runflat"]');
  if (runflatBtn) {
    if (wheels.runflat) runflatBtn.classList.add('active');
    else runflatBtn.classList.remove('active');
  }
}

export function updateQtyDisplay(qty) {
  const qtyVal = document.getElementById('wQtyVal');
  if (qtyVal) qtyVal.textContent = qty;
}

export function renderWheelsModal() {
  const state = getState();
  renderRadiusGrid(state.wheels.radius);
  renderTypeButtons(state.wheels);
  updateQtyDisplay(state.wheels.qty);
}

export function setupWheelsModalHandlers() {
  // Кнопки типа
  document.querySelectorAll('#typeGrid .type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      switch(type) {
        case 'light': setWheelType('light'); break;
        case 'jeep': setWheelType('jeep'); break;
        case 'lowProfile': setLowProfile(!getState().wheels.lowProfile); break;
        case 'runflat': setRunflat(!getState().wheels.runflat); break;
      }
      renderWheelsModal();
    });
  });

  // Кнопки количества (исправлено: заменяем на новые, чтобы избежать накопления обработчиков)
  const minusBtn = document.getElementById('wQtyMinus');
  const plusBtn = document.getElementById('wQtyPlus');

  if (minusBtn) {
    const newMinusBtn = minusBtn.cloneNode(true);
    minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
    newMinusBtn.addEventListener('click', () => {
      decrementWheelQty();
      updateQtyDisplay(getState().wheels.qty);
    });
  }

  if (plusBtn) {
    const newPlusBtn = plusBtn.cloneNode(true);
    plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);
    newPlusBtn.addEventListener('click', () => {
      incrementWheelQty();
      updateQtyDisplay(getState().wheels.qty);
    });
  }

  // Кнопка "Готово"
  const doneBtn = document.querySelector('#mWheels .btn-done');
  if (doneBtn) {
    const newDoneBtn = doneBtn.cloneNode(true);
    doneBtn.parentNode.replaceChild(newDoneBtn, doneBtn);
    newDoneBtn.addEventListener('click', () => {
      applyWheelsToAll();
      closeModal('mWheels');
      updateMainScreen();
    });
  }
}
