// src/js/handlers/reset.js
import { resetOrder } from '../state.js';
import { showConfirm } from '../utils/confirm.js';
import { showToast } from '../utils/toast.js';
import { updateMainScreen } from '../ui/mainScreen.js';

export async function handleReset() {
  const confirmed = await showConfirm('Сброс заказа', 'Очистить все данные заказа?');
  if (!confirmed) return;

  resetOrder(false); // false = не сохранять механиков и клиента
  showToast('Все данные сброшены', 'success');
  updateMainScreen();
}
