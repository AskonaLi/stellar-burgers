import feedDataReducer, {
  feedInitialState,
  getFeedThunk,
  getOrdersThunk
} from './FeedDataSlice';
import { TOrder } from '@utils-types';

// Мокаем API
jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

describe('Тестирование feedDataSlice', () => {
  // Проверка начального состояния
  it('должно вернуть начальное состояние', () => {
    expect(feedDataReducer(undefined, { type: 'unknown' })).toEqual(
      feedInitialState
    );
  });

  describe('Тестирование getFeedThunk', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const state = feedDataReducer(
        feedInitialState,
        getFeedThunk.pending('testRequestId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно установить данные ленты заказов при fulfilled', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            name: 'Тестовый заказ',
            status: 'done',
            createdAt: '',
            updatedAt: '',
            number: 1,
            ingredients: []
          }
        ],
        total: 100,
        totalToday: 10
      };
      const state = feedDataReducer(
        feedInitialState,
        getFeedThunk.fulfilled(payload, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(payload.orders);
      expect(state.total).toBe(payload.total);
      expect(state.totalToday).toBe(payload.totalToday);
      expect(state.error).toBeNull();
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка при загрузке ленты заказов' };
      const state = feedDataReducer(
        feedInitialState,
        getFeedThunk.rejected(error as any, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке ленты заказов');
    });
  });

  describe('Тестирование getOrdersThunk', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const state = feedDataReducer(
        feedInitialState,
        getOrdersThunk.pending('testRequestId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно установить заказы пользователя при fulfilled', () => {
      const payload: TOrder[] = [
        {
          _id: '1',
          name: 'Заказ пользователя',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          number: 2,
          ingredients: []
        }
      ];
      const state = feedDataReducer(
        feedInitialState,
        getOrdersThunk.fulfilled(payload, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка при загрузке заказов пользователя' };
      const state = feedDataReducer(
        feedInitialState,
        getOrdersThunk.rejected(error as any, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке заказов пользователя');
    });
  });
});
