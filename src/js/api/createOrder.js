// src/js/api/createOrder.js
import { API } from '../constants.js';
import { showToast } from '../utils/toast.js';

export async function createOrder(orderData) {
  try {
    console.log('📤 Отправка заказа:', JSON.stringify({
  action: "create_order_tyre",
  data: orderData
}, null, 2));
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.CREATE_ORDER}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "create_order_tyre",
        data: orderData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    return { success: true, orderNumber: result.orderNumber };
  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    showToast('Ошибка отправки заказа', 'error');
    return { success: false, error };
  }
}
