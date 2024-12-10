import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

export type TIngredientsState = {
  ingredients: Array<TIngredient>;
  isLoading: boolean;
  error: null | string | undefined;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Асинхронная операция для получения ингредиентов с сервера
export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

// Слайс для управления состоянием ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsStateSelector: (state) => state,
    getIngredientsSelector: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния при получении ингредиентов
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getIngredients.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = payload;
      });
  }
});

// Экспорт начального состояния и селекторов
export { initialState as ingredientsInitialState };
export const { getIngredientsStateSelector, getIngredientsSelector } =
  ingredientsSlice.selectors;

// Экспорт редьюсера для работы с состоянием
export default ingredientsSlice.reducer;
