import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import { Provider } from 'react-redux';
import store from './services/store';

// Находим элемент с id "root" в DOM, в котором будет монтироваться React-приложение
const container = document.getElementById('root') as HTMLElement;

// Создаем корневой элемент для React-приложения
const root = ReactDOMClient.createRoot(container!);

// Отображаем приложение внутри элемента с id "root"
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
