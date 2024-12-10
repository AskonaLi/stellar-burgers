import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import {
  getConstructorSelector,
  setOrderRequest,
  sendOrderThunk,
  setNullOrderModalData
} from '../../services/slices/BurgerConstructorSlice';

import { isAuthorizedSelector } from '../../services/slices/UserInfoSlice';

// Компонент, который управляет функциональностью конструктора бургеров
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorState = useSelector(getConstructorSelector);
  const constructorItems = constructorState.constructorItems;
  const orderRequest = constructorState.orderRequest;
  const orderModalData = constructorState.orderModalData;
  const isAuthorized = useSelector(isAuthorizedSelector);

  // Обработчик нажатия на кнопку "Оформить заказ"
  const onOrderClick = () => {
    if (constructorItems.bun && !isAuthorized) navigate('/login');
    if (constructorItems.bun && isAuthorized) {
      dispatch(setOrderRequest(true));

      const bunId = constructorItems.bun._id;
      const ingredientsIds = constructorItems.ingredients.map(
        (ingredient) => ingredient._id
      );
      const order = [bunId, ...ingredientsIds, bunId];
      dispatch(sendOrderThunk(order));
    }
  };

  // Обработчик закрытия модального окна
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(setNullOrderModalData());
  };

  // Подсчет общей стоимости заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
