import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearUserError,
  getUserErrorSelector,
  registerUserThunk
} from '../../services/slices/UserInfoSlice';

// Компонент страницы регистрации нового пользователя
export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getUserErrorSelector);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const name = userName;
    dispatch(registerUserThunk({ email, name, password }));
  };

  useEffect(() => {
    dispatch(clearUserError());
  });

  return (
    <RegisterUI
      errorText={error?.toString()}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
