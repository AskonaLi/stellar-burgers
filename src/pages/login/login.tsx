import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TLoginData } from '../../utils/burger-api';
import {
  loginUserThunk,
  clearUserError
} from '../../services/slices/UserInfoSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useNavigate } from 'react-router-dom';

// Компонент страницы с формой авторизации
export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.user.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearUserError());
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
  };

  return (
    <LoginUI
      errorText={error?.toString()}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
