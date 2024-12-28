import userInfoReducer, {
  userInitialState,
  clearUserError,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk
} from './UserInfoSlice';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUserState } from './UserInfoSlice';

// Мокаем localStorage
const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
};

// Мокаем cookie-utils
jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// Устанавливаем мок до выполнения тестов
beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage(),
    writable: true
  });
});

// Убираем мок после тестов
afterAll(() => {
  delete (global as any).localStorage;
});

describe('Тестирование UserInfoSlice', () => {
  // Проверка начального состояния
  it('должно вернуть начальное состояние', () => {
    expect(userInfoReducer(undefined, { type: 'unknown' })).toEqual(
      userInitialState
    );
  });

  // Тестирование действия clearUserError
  it('должно сбросить ошибку с помощью clearUserError', () => {
    const stateWithError: TUserState = {
      ...userInitialState,
      error: 'Ошибка'
    };
    const state = userInfoReducer(stateWithError, clearUserError());
    expect(state.error).toBeNull();
  });

  describe('Тестирование loginUserThunk', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const mockLoginData = {
        email: 'test@example.com',
        password: 'password123'
      }; // Мокируем данные входа
      const state = userInfoReducer(
        userInitialState,
        loginUserThunk.pending('testRequestId', mockLoginData)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно установить пользователя и авторизацию при fulfilled', () => {
      const payload = {
        success: true,
        user: { name: 'Тестовый пользователь', email: 'test@example.com' },
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken'
      };

      const mockLoginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const state = userInfoReducer(
        userInitialState,
        loginUserThunk.fulfilled(payload, 'testRequestId', mockLoginData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(state.error).toBeNull();
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка авторизации' };
      const args = { email: 'test@example.com', password: 'testpassword' };
      const state = userInfoReducer(
        userInitialState,
        loginUserThunk.rejected(error as any, 'testRequestId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('Тестирование registerUserThunk', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const args = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      const state = userInfoReducer(
        userInitialState,
        registerUserThunk.pending('testRequestId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно зарегистрировать пользователя при fulfilled', () => {
      const payload = {
        success: true,
        user: { name: 'Новый пользователь', email: 'new@example.com' },
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken'
      };

      const args = {
        name: 'Новый пользователь',
        email: 'new@example.com',
        password: 'password123'
      };

      const state = userInfoReducer(
        userInitialState,
        registerUserThunk.fulfilled(payload, 'testRequestId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(state.error).toBeNull();
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка регистрации' };
      const args = {
        name: 'Новый пользователь',
        email: 'new@example.com',
        password: 'password123'
      };

      const state = userInfoReducer(
        userInitialState,
        registerUserThunk.rejected(error as any, 'testRequestId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('Тестирование logoutUserThunk', () => {
    it('должно установить isLoading в true при состоянии pending', () => {
      const state = userInfoReducer(
        userInitialState,
        logoutUserThunk.pending('testRequestId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно удалить данные пользователя и авторизацию при fulfilled', () => {
      const state = userInfoReducer(
        {
          ...userInitialState,
          user: { name: 'Тест', email: 'test@example.com' },
          isAuthorized: true
        },
        logoutUserThunk.fulfilled({ success: true }, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBe(false);
      expect(state.error).toBeNull();
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('должно установить сообщение об ошибке при rejected', () => {
      const error = { message: 'Ошибка выхода из системы' };
      const state = userInfoReducer(
        userInitialState,
        logoutUserThunk.rejected(error as any, 'testRequestId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка выхода из системы');
    });
  });

  describe('Тестирование updateUserThunk', () => {
    it('должно обновить данные пользователя при fulfilled', () => {
      const payload = {
        success: true,
        user: { name: 'Обновленный пользователь', email: 'updated@example.com' }
      };

      const args = {
        name: 'Обновленный пользователь',
        email: 'updated@example.com'
      };

      const state = userInfoReducer(
        userInitialState,
        updateUserThunk.fulfilled(payload, 'testRequestId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.error).toBeNull();
    });
  });
});
