import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData
} from '../../utils/burger-api';

import { TRegisterData } from '../../utils/burger-api';

export interface TUserState {
  isLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  error: string | null;
}

const initialState: TUserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  error: null
};

// Асинхронные операции для работы с пользователем

export const loginUserThunk = createAsyncThunk(
  'user/login',
  (loginData: TLoginData) => loginUserApi(loginData)
);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  (registerData: TRegisterData) => registerUserApi(registerData)
);

export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const updateUser = createAsyncThunk('user/update', updateUserApi);

// Слайс для управления состоянием пользователя
export const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    getUserStateSelector: (state) => state,
    getUserSelector: (state) => state.user,
    isAuthorizedSelector: (state) => state.isAuthorized,
    getUserErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Логика для обработки асинхронных операций, связанных с пользователем
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.isAuthorized = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthorized = true;
        state.user = payload.user;
      });
  }
});

// Экспорт начального состояния
export { initialState as userInitialState };

// Экспорт действия для сброса ошибки
export const { clearUserError } = userInfoSlice.actions;

// Экспорт селекторов для получения состояния
export const {
  getUserStateSelector,
  getUserSelector,
  isAuthorizedSelector,
  getUserErrorSelector
} = userInfoSlice.selectors;

// Экспорт редьюсера для управления состоянием пользователя
export default userInfoSlice.reducer;
