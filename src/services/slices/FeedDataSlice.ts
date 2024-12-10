import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';

export type TfeedState = {
  isLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TfeedState = {
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

// Асинхронные операции для получения данных о ленте заказов и заказах пользователя
export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);
export const getOrdersThunk = createAsyncThunk(
  'feed/getProfileFeed',
  getOrdersApi
);

// Слайс для управления состоянием ленты заказов
const feedDataSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedStateSelector: (state) => state,
    getOrdersSelector: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния при получении данных о ленте заказов
      .addCase(getFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getFeedThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      // Обработка состояния при получении заказов пользователя
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orders = payload;
      });
  }
});

// Экспорт начального состояния и селекторов
export { initialState as feedInitialState };
export const { getFeedStateSelector, getOrdersSelector } =
  feedDataSlice.selectors;

// Экспорт редьюсера для работы с состоянием
export default feedDataSlice.reducer;
