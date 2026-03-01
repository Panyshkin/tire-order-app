// src/js/ui/mainScreen.js
// Обновление главного экрана

import { getState, getTotalSum, getSelectedCounts } from '../state.js';
import { MAIN_SCREEN_IDS } from '../constants.js';

export function updateMainScreen() {
  // Обновляем информацию о механиках
  const dMechanics = 
document.getElementById(MAIN_SCREEN_IDS.MECHANICS);
  if (dMechanics) {
    const selected = getState().mechanics;
    dMechanics.textContent = selected.length ? selected.join(', ') : 'Выберите механиков';
  }

  // Обновляем информацию о клиенте
  const dClient = 
document.getElementById(MAIN_SCREEN_IDS.CLIENT);
  if (dClient) {
    const client = getState().client;
    if (client.name || client.car) {
      dClient.textContent = `${client.name} ${client.car}`.trim() || 'Добавить информацию';
    } else {
      dClient.textContent = 'Добавить информацию';
    }
  }

  // Обновляем информацию о колёсах
  const dWheels = 
document.getElementById(MAIN_SCREEN_IDS.WHEELS);
  if (dWheels) {
    const wheels = getState().wheels;
    dWheels.textContent = `${wheels.radius}" ${wheels.qty}шт 
${wheels.type === 'jeep' ? 'джип' : 'легк'} ${wheels.lowProfile ? 
'низк ' : ''}${wheels.runflat ? 'runflat' : ''}`.trim() || 'Не выбраны';
  }

  // Обновляем информацию о материалах
  const dMaterials = 
document.getElementById(MAIN_SCREEN_IDS.MATERIALS);
  if (dMaterials) {
    const counts = getSelectedCounts();
    if (counts.materials > 0) {
      dMaterials.textContent = `${counts.materials} позиций`;
    } else {
      dMaterials.textContent = 'Нет позиций';
    }
  }

  // Обновляем информацию об услугах
  const dServices = 
document.getElementById(MAIN_SCREEN_IDS.SERVICES);
  if (dServices) {
    const counts = getSelectedCounts();
    if (counts.services > 0) {
      dServices.textContent = `${counts.services} позиций`;
    } else {
      dServices.textContent = 'Нет позиций';
    }
  }

  // Обновляем общую сумму
  const btnSaveSum = 
document.getElementById(MAIN_SCREEN_IDS.TOTAL_SUM);
  if (btnSaveSum) {
    const total = getTotalSum();
    btnSaveSum.textContent = `${total.toLocaleString()} ₽`;
  }
}
