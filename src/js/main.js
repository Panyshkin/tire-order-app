//Главное окно приложения

import { handleReset } from './handlers/reset.js';
import { handleCreateOrder } from './handlers/order.js';
import { renderServicesModal, setupServicesModalHandlers } from './ui/servicesModal.js';
import { renderMaterialsModal, setupMaterialsModalHandlers } from './ui/materialsModal.js';
import { renderClientModal, setupClientModalHandlers } from './ui/clientModal.js';
import { renderMechanicsModal, setupMechanicsModalHandlers } from './ui/mechanicsModal.js';
import { loadFromStorage } from './storage.js';
import { initState, subscribe, getTotalSum, getSelectedCounts } from './state.js';
import { setupConfirmHandlers } from './utils/confirm.js';
import { registerModal, openModal } from './utils/modal.js';
import { showToast } from './utils/toast.js';
import { MODAL_IDS, MAIN_SCREEN_IDS } from './constants.js';
import { renderWheelsModal, setupWheelsModalHandlers } from './ui/wheelsModal.js';
import { renderSettingsModal, setupSettingsModalHandlers } from './ui/settingsModal.js';

// Инициализация приложения
async function initApp() {
  console.log('🚀 Запуск приложения...');
  
  // 1. Загружаем данные из localStorage
  loadFromStorage();
  
  // 2. Инициализируем состояние
  initState();
  
  // 3. Регистрируем обработчики диалогов
  setupConfirmHandlers();
  
  // 4. Регистрируем модальные окна
  registerModals();
  
  // 5. Настраиваем обработчики событий
  setupEventListeners();
  
  // 6. Подписываемся на изменения состояния
  subscribe(updateMainScreen);
  
  // 7. Обновляем главный экран
  updateMainScreen();
  
  // 8. Показываем приветствие
  showToast('Приложение готово к работе');
  
  console.log('✅ Приложение запущено');
}

// Регистрация всех модальных окон
function registerModals() {
  // Механики
registerModal(MODAL_IDS.MECHANICS, {
  onOpen: () => {
    console.log('Открыта модалка механиков');
    renderMechanicsModal();
    setupMechanicsModalHandlers();
  }
});  

  // Клиент
  registerModal(MODAL_IDS.CLIENT, {
    onOpen: () => {
      console.log('Открыта модалка клиента');
      renderClientModal();
      setupClientModalHandlers();
    }
  });
  
  // Колёса
  registerModal(MODAL_IDS.WHEELS, {
    onOpen: () => {
        console.log('Открыта модалка колёс')
	renderWheelsModal();
}
  });
  
  // Материалы
  registerModal(MODAL_IDS.MATERIALS, {
    onOpen: () => {
      console.log('Открыта модалка материалов');
      renderMaterialsModal();
      setupMaterialsModalHandlers();
    }
  });
  
  // Услуги
  registerModal(MODAL_IDS.SERVICES, {
    onOpen: () => {
      console.log('Открыта модалка услуг');
      renderServicesModal();
      setupServicesModalHandlers();
    }
  });
  
  // Настройки
    // Настройки
  registerModal(MODAL_IDS.SETTINGS, {
    onOpen: () => {
      console.log('Открыта модалка настроек');
      renderSettingsModal();
      setupSettingsModalHandlers();
    }
  });
  
  // История
  registerModal(MODAL_IDS.HISTORY, {
    onOpen: () => console.log('Открыта модалка истории')
  });
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Открытие модалок по клику на карточки
  document.querySelectorAll('[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      const modalName = card.dataset.modal; // 'mechanics', 'client' и т.д.
      const modalId = `m${modalName.charAt(0).toUpperCase() + modalName.slice(1)}`;
      openModal(modalId);
	setupWheelsModalHandlers();
    });
  });
  
  // Кнопка настроек
  const btnSettings = document.getElementById('btnSettings');
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      openModal(MODAL_IDS.SETTINGS);
    });
  }
  
  // Кнопка истории
  const btnHistory = document.getElementById('btnHistory');
  if (btnHistory) {
    btnHistory.addEventListener('click', () => {
      openModal(MODAL_IDS.HISTORY);
    });
  }

// Кнопка сброса
const btnReset = document.getElementById('btnReset');
if (btnReset) {
  btnReset.addEventListener('click', handleReset);
}  

// Кнопка создания заказа
const btnCreateOrder = document.getElementById('btnCreateOrder');
if (btnCreateOrder) {
  btnCreateOrder.addEventListener('click', handleCreateOrder);
}
}

// Обновление главного экрана
function updateMainScreen() {
  // Обновляем информацию о механиках
  const dMechanics = document.getElementById(MAIN_SCREEN_IDS.MECHANICS);
  if (dMechanics) {
    // TODO: показать выбранных механиков
    dMechanics.textContent = 'Выберите механиков';
  }
  
  // Обновляем информацию о клиенте
  const dClient = document.getElementById(MAIN_SCREEN_IDS.CLIENT);
  if (dClient) {
    // TODO: показать данные клиента
    dClient.textContent = 'Добавить информацию';
  }
  
  // Обновляем информацию о колёсах
  const dWheels = document.getElementById(MAIN_SCREEN_IDS.WHEELS);
  if (dWheels) {
    // TODO: показать параметры колёс
    dWheels.textContent = 'Не выбраны';
  }
  
  // Обновляем информацию о материалах
  const dMaterials = document.getElementById(MAIN_SCREEN_IDS.MATERIALS);
  if (dMaterials) {
    const counts = getSelectedCounts();
    if (counts.materials > 0) {
      dMaterials.textContent = `${counts.materials} позиций`;
    } else {
      dMaterials.textContent = 'Нет позиций';
    }
  }
  
  // Обновляем информацию об услугах
  const dServices = document.getElementById(MAIN_SCREEN_IDS.SERVICES);
  if (dServices) {
    const counts = getSelectedCounts();
    if (counts.services > 0) {
      dServices.textContent = `${counts.services} позиций`;
    } else {
      dServices.textContent = 'Нет позиций';
    }
  }
  
  // Обновляем общую сумму
  const btnSaveSum = document.getElementById(MAIN_SCREEN_IDS.TOTAL_SUM);
  if (btnSaveSum) {
    const total = getTotalSum();
    btnSaveSum.textContent = `${total.toLocaleString()} ₽`;
  }
}

// Вспомогательная функция (пока заглушка)

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
