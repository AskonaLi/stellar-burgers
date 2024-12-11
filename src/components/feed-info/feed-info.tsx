import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getFeedStateSelector } from '../../services/slices/FeedDataSlice';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// Копонент-обертка для отображения информации о заказах в ленте
export const FeedInfo: FC = () => {
  const ordersState = useSelector(getFeedStateSelector);
  const orders: TOrder[] = ordersState.orders;
  const feed = { total: ordersState.total, totalToday: ordersState.totalToday };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
