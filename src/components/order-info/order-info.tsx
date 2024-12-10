import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  getOrderSelector,
  fetchOrderThunk
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getIngredientsSelector } from '../../services/slices/IngredientsSlice';

// Jтображает подробную информацию о заказе, включая ингредиенты и общую стоимость. Загружает данные о заказе из Redux при первом рендере, если они еще не загружены.
export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const orderNumber = Number(useParams().number);

  useEffect(() => {
    dispatch(fetchOrderThunk(orderNumber));
  }, [dispatch]);

  const orderData = useSelector(getOrderSelector).order;

  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
