import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

// Тип состояния, которое будет храниться в Redux для конструктора бургера
type TBurgerConstructorState = {
  isLoading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: null | string | undefined;
};

// Начальное состояние
const initialState: TBurgerConstructorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронная операция для отправки заказа
export const sendOrderThunk = createAsyncThunk(
  'burgerconstructor/sendOrder',
  (data: string[]) => orderBurgerApi(data)
);

// Слайс для конструктора бургера
const burgerConstructorSlice = createSlice({
  name: 'burgerconstructor',
  initialState,
  reducers: {
    // Экшен для добавления ингредиента в конструктор
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, id: key } }; // Генерируем уникальный ID для каждого ингредиента
      },
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient & { id: string }>
      ) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload; // Если ингредиент - булочка, заменяем её
        } else {
          state.constructorItems.ingredients.push(action.payload); // Добавляем новый ингредиент в список
        }
      }
    },
    // Экшен для удаления ингредиента из конструктора
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id != action.payload
        );
    },
    // Экшен для установки флага, что заказ отправляется
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    // Экшен для сброса данных о заказе (например, после успешной отправки)
    setNullOrderModalData: (state) => {
      state.orderModalData = null;
    },
    // Экшен для перемещения ингредиента вниз в списке
    moveIngredientDown: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload + 1]
      ] = [
        state.constructorItems.ingredients[action.payload + 1], // Меняем местами два ингредиента
        state.constructorItems.ingredients[action.payload]
      ];
    },
    // Экшен для перемещения ингредиента вверх в списке
    moveIngredientUp: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload - 1]
      ] = [
        state.constructorItems.ingredients[action.payload - 1], // Меняем местами два ингредиента
        state.constructorItems.ingredients[action.payload]
      ];
    }
  },
  // Селекторы и обработка асинхронных действий
  selectors: {
    getConstructorSelector: (state) => state // Селектор для получения состояния конструктора
  },
  extraReducers: (builder) => {
    builder
      // При запуске асинхронной операции (отправка заказа)
      .addCase(sendOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // При ошибке отправки заказа
      .addCase(sendOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      // При успешной отправке заказа
      .addCase(sendOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

// Экспорт начального состояния и экшенов
export { initialState as constructorInitialState };
export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setNullOrderModalData,
  moveIngredientDown,
  moveIngredientUp
} = burgerConstructorSlice.actions;

// Селектор для получения состояния конструктора
export const { getConstructorSelector } = burgerConstructorSlice.selectors;

// Экспорт редьюсера
const burgerConstructorReducer = burgerConstructorSlice.reducer;
export default burgerConstructorReducer;
