import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { isAuthorizedSelector } from '../../services/slices/UserInfoSlice';

type ProtectedRouteProps = {
  forAuthorized: boolean;
};

// Компонент для защиты маршрутов в зависимости от авторизации пользователя. Перенаправляет на нужную старницу в зависимости от состояния авторизации.
export const ProtectedRoute = ({
  forAuthorized = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthorized = useSelector(isAuthorizedSelector);
  const from = location.state?.from || '/';

  if (!forAuthorized && isAuthorized) {
    return <Navigate to={from} />;
  }

  if (forAuthorized && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <Outlet />;
};
