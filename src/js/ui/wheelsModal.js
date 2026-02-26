// src/js/ui/wheelsModal.js
// Рендер модального окна параметров колёс

import { WHEELS } from '../constants.js';
import { getState, setWheelRadius, setWheelType, setLowProfile, setRunflat, incrementWheelQty, decrementWheelQty } from '../state.js';

/**
 * Рендер сетки радиусов
 * @param {number} currentRadius - Текущий выбранный радиус
 */
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
        html += '<div></div>'; // пустой div для заполнения сетки
      }
    }
    html += '</div>';
  }
  
  grid.innerHTML = html;
  
  // Добавляем обработчики
  grid.querySelectorAll('.radius-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const radius = parseInt(btn.dataset.radius);
      setWheelRadius(radius);
      renderWheelsModal(); // обновляем всю модалку
    });
  });
}

/**
 * Рендер кнопок типа
 * @param {Object} wheels - Текущие параметры колёс
 */
export function renderTypeButtons(wheels) {
  const typeGrid = document.getElementById('typeGrid');
  if (!typeGrid) return;
  
  // Легковая
  const lightBtn = typeGrid.querySelector('[data-type="light"]');
  if (lightBtn) {
    if (wheels.type === 'light') {
      lightBtn.classList.add('active');
    } else {
      lightBtn.classList.remove('active');
    }
  }
  
  // Джип
  const jeepBtn = typeGrid.querySelector('[data-type="jeep"]');
  if (jeepBtn) {
    if (wheels.type === 'jeep') {
      jeepBtn.classList.add('active');
    } else {
      jeepBtn.classList.remove('active');
    }
  }
  
  // Низкий профиль
  const lowProfileBtn = typeGrid.querySelector('[data-type="lowProfile"]');
  if (lowProfileBtn) {
    if (wheels.lowProfile) {
      lowProfileBtn.classList.add('active');
    } else {
      lowProfileBtn.classList.remove('active');
    }
  }
  
  // RunFlat
  const runflatBtn = typeGrid.querySelector('[data-type="runflat"]');
  if (runflatBtn) {
    if (wheels.runflat) {
      runflatBtn.classList.add('active');
    } else {
      runflatBtn.classList.remove('active');
    }
  }
}

/**
 * Обновить отображение количества
 * @param {number} qty - Текущее количество
 */
export function updateQtyDisplay(qty) {
  const qtyVal = document.getElementById('wQtyVal');
  if (qtyVal) {
    qtyVal.textContent = qty;
  }
}

/**
 * Полный рендер модалки колёс
 */
export function renderWheelsModal() {
  const state = getState();
  
  renderRadiusGrid(state.wheels.radius);
  renderTypeButtons(state.wheels);
  updateQtyDisplay(state.wheels.qty);
}

/**
 * Настройка обработчиков событий для модалки колёс
 */
export function setupWheelsModalHandlers() {
  // Кнопки типа
  document.querySelectorAll('#typeGrid .type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      
      switch(type) {
        case 'light':
          setWheelType('light');
          break;
        case 'jeep':
          setWheelType('jeep');
          break;
        case 'lowProfile':
          setLowProfile(!getState().wheels.lowProfile);
          break;
        case 'runflat':
          setRunflat(!getState().wheels.runflat);
          break;
      }
      
      renderWheelsModal();
    });
  });
  
  // Кнопки количества
  const minusBtn = document.getElementById('wQtyMinus');
  const plusBtn = document.getElementById('wQtyPlus');
  
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      decrementWheelQty();
      updateQtyDisplay(getState().wheels.qty);
    });
  }
  
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      incrementWheelQty();
      updateQtyDisplay(getState().wheels.qty);
    });
  }
  
  // Кнопка "Применить ко всем"
  const applyAllBtn = document.getElementById('applyAll');
  if (applyAllBtn) {
    applyAllBtn.addEventListener('click', () => {
      // TODO: реализовать логику "Применить ко всем"
      console.log('Применить ко всем');
    });
  }
  
  // Кнопка "Готово"
  const doneBtn = document.querySelector('#mWheels .btn-done');
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      // Просто закрываем модалку
      import('../utils/modal.js').then(({ closeModal }) => {
        closeModal('mWheels');
      });
    });
  }
}
