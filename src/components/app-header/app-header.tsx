import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/slices/UserInfoSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserSelector);
  return (
    <>
      <AppHeaderUI userName={userName?.name} />;
    </>
  );
};
