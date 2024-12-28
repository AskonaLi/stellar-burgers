import orderReducer, { orderInitialState, fetchOrderThunk } from './orderSlice';

// Мокаем API
jest.mock('../../utils/burger-api', () => ({
  getOrderByNumberApi: jest.fn()
}));

describe('Тестирование orderSlice', () => {
  // Проверка начального состояния
  it('должно вернуть начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(
      orderInitialState
    );
  });

  describe('Тестирование fetchOrderThunk', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const state = orderReducer(
        orderInitialState,
        fetchOrderThunk.pending('testRequestId', 123)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно установить данные заказа при fulfilled', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            name: 'Тестовый заказ',
            status: 'done',
            createdAt: '',
            updatedAt: '',
            number: 123,
            ingredients: []
          }
        ]
      };

      const state = orderReducer(
        orderInitialState,
        fetchOrderThunk.fulfilled(payload, 'testRequestId', 123)
      );

      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(payload.orders[0]);
      expect(state.error).toBeNull();
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка при загрузке заказа' };
      const state = orderReducer(
        orderInitialState,
        fetchOrderThunk.rejected(
          error as any,
          'testRequestId',
          123,
          false,
          false
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке заказа');
    });
  });
});
