import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/IngredientsSlice';
import feedReducer from './slices/FeedDataSlice';
import burgerConstructorReducer from './slices/BurgerConstructorSlice';
import userInfoReducer from './slices/UserInfoSlice';
import orderReducer from './slices/orderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объединяем все редьюсеры в один с помощью combineReducers
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerconstructor: burgerConstructorReducer,
  user: userInfoReducer,
  order: orderReducer
});

// Создаем store, передавая объединенные редьюсеры
// Также настраиваем devTools, которые включаются только в режиме разработки
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export { rootReducer };

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

// Создаем типизированные версии хуков useDispatch и useSelector
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
