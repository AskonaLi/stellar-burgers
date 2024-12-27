import { rootReducer } from './store';

// Импорт редьюсеров
import ingredientsReducer from './slices/IngredientsSlice';
import feedReducer from './slices/FeedDataSlice';
import burgerConstructorReducer from './slices/BurgerConstructorSlice';
import userInfoReducer from './slices/UserInfoSlice';
import orderReducer from './slices/orderSlice';

test('Корректная инициализация rootReducer', () => {
  // Ожидаемое начальное состояние, полученное вызовом редьюсеров
  const expectedInitialState = {
    ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
    feed: feedReducer(undefined, { type: 'UNKNOWN_ACTION' }),
    burgerconstructor: burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    }),
    user: userInfoReducer(undefined, { type: 'UNKNOWN_ACTION' }),
    order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' })
  };

  // Сравниваем результат работы rootReducer с ожидаемым состоянием
  expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
    expectedInitialState
  );
});
