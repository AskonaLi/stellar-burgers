import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface OrderState {
  isLoading: boolean;
  order: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  isLoading: false,
  order: null,
  error: null
};

// Асинхронная операция для получения заказа по номеру
export const fetchOrderThunk = createAsyncThunk(
  'feed/getOrder',
  (number: number) => getOrderByNumberApi(number)
);

// Слайс для управления состоянием заказа
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния при запросе заказа
      .addCase(fetchOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(fetchOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.order = payload.orders[0];
      });
  }
});

// Экспорт начального состояния и селектора
export { initialState as orderInitialState };
export const { getOrderSelector } = orderSlice.selectors;

// Экспорт редьюсера для работы с состоянием
const orderReducer = orderSlice.reducer;
export default orderReducer;
