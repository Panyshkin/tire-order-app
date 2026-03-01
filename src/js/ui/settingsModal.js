// src/js/ui/settingsModal.js
// Рендер и обработчики модального окна настроек

import { SUBDIVISIONS } from '../constants.js';
import {
  getMechanics,
  getMaterials,
  getServices,
  getCurrentSubdivision,
  fetchFrom1C,
  resetToDefaults
} from '../storage.js';
import { showToast } from '../utils/toast.js';
import { closeModal } from '../utils/modal.js';

/**
 * Рендер содержимого модалки настроек
 */
export function renderSettingsModal() {
  const body = document.getElementById('settingsBody');
  if (!body) return;

  const mechanics = getMechanics();
  const materials = getMaterials();
  const services = getServices();
  const currentSubdiv = getCurrentSubdivision();

  // Все строки написаны без разрывов внутри кода
  const mechanicsHtml = mechanics.map(m => `<div 
class="settings-item">${m}</div>`).join('') || '<div class="empty-state">Нет механиков</div>';

  const materialsHtml = materials.map(m =>
    `<div class="settings-item">
       <span class="svc-name">${m.name}</span>
       <span class="svc-price">${m.price} ₽</span>
     </div>`).join('') || '<div class="empty-state">Нет материалов</div>';

  const servicesHtml = services.map(s =>
    `<div class="settings-item">
       <span class="svc-name">${s.name}</span>
       <span class="svc-price">${s.price} ₽</span>
       ${s.radius ? `<span 
class="svc-radius">R${s.radius}</span>` : ''}
       ${s.carType ? `<span class="svc-car-type">${s.carType 
=== 'light' ? 'легк' : 'джип'}</span>` : ''}
       ${s.lowProfile ? `<span class="svc-flag">низк</span>` 
: ''}
       ${s.runflat ? `<span class="svc-flag">runflat</span>` 
: ''}
     </div>` ).join('') || '<div class="empty-state">Нет услуг</div>';

  const html = `
    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-download"></i> Загрузка из 1С
      </div>
      <div class="settings-item">
        <select id="settingsSubdivision" class="field-input" 
style="flex:1;">
          ${SUBDIVISIONS.map(s => `<option value="${s}" ${s 
=== currentSubdiv ? 'selected' : 
''}>${s}</option>`).join('')}
        </select>
        <button type="button" class="btn-done" 
id="settingsLoadBtn"><i class="fa-solid fa-download"></i> Загрузить</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-users"></i> Механики 
(${mechanics.length})
      </div>
      <div class="settings-list">
        ${mechanicsHtml}
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-box-open"></i> Материалы 
(${materials.length})
      </div>
      <div class="settings-list">
        ${materialsHtml}
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-wrench"></i> Услуги 
(${services.length})
      </div>
      <div class="settings-list">
        ${servicesHtml}
      </div>
    </div>

    <div class="settings-section">
      <button class="settings-reset-defaults" 
id="settingsResetBtn">
        <i class="fa-solid fa-rotate-left"></i> Сбросить к заводским настройкам
      </button>
    </div>
  `;

  body.innerHTML = html;
}

/**
 * Настройка обработчиков событий для модалки настроек
 */
export function setupSettingsModalHandlers() {
  const loadBtn = 
document.getElementById('settingsLoadBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', async () => {
      const select = 
document.getElementById('settingsSubdivision');
      const subdivision = select.value;

      loadBtn.disabled = true;
      loadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-pulse"></i> Загрузка...';

      const result = await fetchFrom1C(subdivision);

      loadBtn.disabled = false;
      loadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Загрузить';

      if (result.success) {
        showToast('Данные загружены', 'success');
        renderSettingsModal();          // обновляем списки
        setupSettingsModalHandlers();   // перевешиваем обработчики на новые элементы
      } else {
        showToast('Ошибка загрузки', 'error');
      }
    });
  }

  const resetBtn = 
document.getElementById('settingsResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetToDefaults();
      renderSettingsModal();
      setupSettingsModalHandlers(); // обязательно перевесить обработчики после сброса
      showToast('Сброшено к заводским настройкам', 'success');
    });
  }

  const saveBtn = document.querySelector('#mSettings .btn-done:not(#settingsLoadBtn)'); // выбираем кнопку "Сохранить" в футере, исключая кнопку загрузки
  if (saveBtn) {
    // Убираем старые обработчики, заменяя кнопку новой
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    newSaveBtn.addEventListener('click', () => {
      closeModal('mSettings');
    });
  }
}
