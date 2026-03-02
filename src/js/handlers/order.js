// src/js/handlers/order.js
import { getState, validateOrder, getOrderData, resetOrder } from '../state.js';
import { createOrder } from '../api/index.js';
import { showConfirm } from '../utils/confirm.js';
import { showToast } from '../utils/toast.js';
import { saveOrderToHistory } from '../storage.js';

export async function handleCreateOrder() {
  // 1. Валидация
  const validation = validateOrder();
  if (!validation.valid) {
    showToast(validation.errors[0], 'error');
    return;
  }

  // 2. Подтверждение
  const confirmed = await showConfirm('Подтверждение', 'Отправить заказ в 1С?');
  if (!confirmed) return;

  // 3. Получение данных
  const orderData = getOrderData();

  // 4. Отправка
  const result = await createOrder(orderData);

  // 5. Обработка ответа
  if (result.success) {
    showToast(`Заказ №${result.orderNumber} создан`, 'success');
    saveOrderToHistory({
      ...orderData,
      orderNumber: result.orderNumber,
      date: new Date().toISOString(),
      paid: false
    });
    resetOrder(true); // сброс, но механики и клиент остаются
  } else {
    showToast('Ошибка при создании заказа', 'error');
  }
}
