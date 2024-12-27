import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  constructorInitialState
} from './BurgerConstructorSlice';
import { TConstructorIngredient } from '../../utils/types';
import { describe, it, expect } from '@jest/globals';

// Константа для тестового ингредиента 'Филе Люминесцентного тетраодонтимформа'
const filletTetraodontimformIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  id: 'meat-03'
};

// Константа для тестового ингредиента 'Соус традиционный галактический'
const traditionalSauceIngredient: TConstructorIngredient = {
  ...filletTetraodontimformIngredient,
  _id: '643d69a5c3f7b9001cfa0944',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
  id: 'sauce-03'
};

describe('Тесты BurgerConstructorSlice reducer', () => {
  it('Добавление ингредиента при вызове addIngredient', () => {
    const initialState = constructorInitialState;

    const state = burgerConstructorReducer(
      initialState,
      addIngredient(filletTetraodontimformIngredient)
    );

    // Проверяем, что ингредиент был добавлен
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining({
        ...filletTetraodontimformIngredient,
        id: expect.any(String) // Проверяем, что id был добавлен
      })
    );
  });

  it('Удаление ингредиента при вызове removeIngredient', () => {
    const initialState = {
      ...constructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [
          filletTetraodontimformIngredient,
          traditionalSauceIngredient
        ]
      }
    };

    const state = burgerConstructorReducer(
      initialState,
      removeIngredient(traditionalSauceIngredient.id)
    );

    // Проверяем, что ингредиент был удален
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(
      filletTetraodontimformIngredient
    );
  });

  it('Перемещение ингредиента вниз при вызове moveIngredientDown', () => {
    const initialState = {
      ...constructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [
          filletTetraodontimformIngredient,
          traditionalSauceIngredient
        ]
      }
    };

    const state = burgerConstructorReducer(
      initialState,
      moveIngredientDown(0) // Перемещаем первый ингредиент вниз
    );

    // Проверяем, что порядок ингредиентов изменился
    expect(state.constructorItems.ingredients[0]).toEqual(
      traditionalSauceIngredient
    );
    expect(state.constructorItems.ingredients[1]).toEqual(
      filletTetraodontimformIngredient
    );
  });

  it('Перемещение ингредиент вверх при вызове moveIngredientUp', () => {
    const initialState = {
      ...constructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [
          traditionalSauceIngredient,
          filletTetraodontimformIngredient
        ]
      }
    };

    const state = burgerConstructorReducer(
      initialState,
      moveIngredientUp(1) // Перемещаем второй ингредиент (филе) вверх
    );

    // Проверяем, что порядок ингредиентов изменился
    expect(state.constructorItems.ingredients[0]).toEqual(
      filletTetraodontimformIngredient
    );
    expect(state.constructorItems.ingredients[1]).toEqual(
      traditionalSauceIngredient
    );
  });
});
