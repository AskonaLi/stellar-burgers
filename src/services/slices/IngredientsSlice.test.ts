import ingredientsReducer, {
  ingredientsInitialState,
  getIngredients
} from './IngredientsSlice';
import { TIngredient } from '@utils-types';

// Мокаем API
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Тестирование ingredientsSlice', () => {
  // Проверка начального состояния
  it('должно вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      ingredientsInitialState
    );
  });

  describe('Тестирование getIngredients', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const state = ingredientsReducer(
        ingredientsInitialState,
        getIngredients.pending('testRequestId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно установить данные ингредиентов при fulfilled', () => {
      const payload: TIngredient[] = [
        {
          _id: '1',
          name: 'Тестовый ингредиент',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 150,
          price: 50,
          image: 'image_url',
          image_mobile: 'image_mobile_url',
          image_large: 'image_large_url'
        }
      ];
      const state = ingredientsReducer(
        ingredientsInitialState,
        getIngredients.fulfilled(payload, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка при загрузке ингредиентов' };
      const state = ingredientsReducer(
        ingredientsInitialState,
        getIngredients.rejected(error as any, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке ингредиентов');
    });
  });
});
