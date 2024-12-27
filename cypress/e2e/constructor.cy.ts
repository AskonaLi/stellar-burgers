// Начальные данные ингредиентов
const BUN_ID_1 = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`; // Селектор для первой булки
const BUN_ID_2 = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`; // Селектор для второй булки
const FILLING_ID = `[data-cy=${'643d69a5c3f7b9001cfa0940'}]`; // Селектор для начинки (отбивной)

// Настройка тестов
beforeEach(() => {
  // Подменяем запросы к API фиктивными данными из фикстур
  cy.intercept('GET', '/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients'); // Загружаем данные о ингредиентах

  cy.intercept('POST', '/api/auth/login', {
    fixture: 'user.json'
  }).as('login'); // Эмулируем авторизацию

  cy.intercept('GET', '/api/auth/user', {
    fixture: 'user.json'
  }).as('getUser'); // Загружаем информацию о пользователе

  cy.intercept('POST', '/api/orders', {
    fixture: 'order.json'
  }).as('createOrder'); // Подменяем создание заказа фиктивным запросом

  // Устанавливаем токены авторизации в локальное хранилище и cookies
  window.localStorage.setItem('refreshToken', 'refreshToken');
  cy.setCookie('accessToken', 'accessToken');

  // Переходим на главную страницу перед каждым тестом
  cy.visit('/');
  cy.viewport(1440, 800); // Задаем размер окна браузера
  cy.wait('@getIngredients'); // Ждем загрузки данных ингредиентов
  cy.get('#modals').as('modal'); // Присваиваем модальному окну псевдоним для удобства
});

// Тестирование добавления ингредиентов в конструктор
describe('Добавление ингредиента в конструктор', () => {
  it('Увеличение счётчика ингредиента при добавлении в конструктор', () => {
    cy.get(FILLING_ID).children('button').click(); // Нажимаем кнопку добавления начинки
    cy.get(FILLING_ID).find('.counter__num').contains('1'); // Проверяем увеличение счётчика
  });

  describe('Добавление булок и начинок', () => {
    it('Добавление булки и начинки в конструктор', () => {
      cy.get(BUN_ID_1).children('button').click(); // Добавляем первую булку
      cy.get(FILLING_ID).children('button').click(); // Добавляем начинку
    });

    it('Добавление булки после добавления начинки в конструктор', () => {
      cy.get(FILLING_ID).children('button').click(); // Добавляем начинку
      cy.get(BUN_ID_1).children('button').click(); // Добавляем первую булку
    });
  });

  describe('Замена булок', () => {
    it('Замена булки на другую без начинки в конструкторе', () => {
      cy.get(BUN_ID_1).children('button').click(); // Добавляем первую булку
      cy.get(BUN_ID_2).children('button').click(); // Меняем её на вторую булку
    });

    it('Замена булки на другую с добавленной начинкой в конструкторе', () => {
      cy.get(BUN_ID_1).children('button').click(); // Добавляем первую булку
      cy.get(FILLING_ID).children('button').click(); // Добавляем начинку
      cy.get(BUN_ID_2).children('button').click(); // Меняем первую булку на вторую
    });
  });
});

// Тестирование модальных окон
describe('Тестирование модального окна', () => {
  it('Открытие и проверка отображения модального окна с информацией об ингредиенте', () => {
    cy.get('@modal').should('be.empty'); // Проверяем, что модальное окно изначально пусто
    cy.get(FILLING_ID).children('a').click(); // Нажимаем на ссылку внутри элемента начинки
    cy.get('@modal').should('not.be.empty'); // Проверяем, что модальное окно открылось
    cy.url().should('include', '643d69a5c3f7b9001cfa0940'); // Проверяем, что URL обновился
  });

  it('Закрытие модального окна с помощью кнопки закрытия', () => {
    cy.get('@modal').should('be.empty'); // Проверяем, что модальное окно изначально пусто
    cy.get(FILLING_ID).children('a').click(); // Открываем модальное окно
    cy.get('@modal').should('not.be.empty'); // Проверяем, что окно открылось
    cy.get('@modal').find('button').click(); // Нажимаем на крестик для закрытия окна
    cy.get('@modal').should('be.empty'); // Проверяем, что окно закрылось
  });

  it('Закрытие модального окна с помощью клавиши Escape', () => {
    cy.get('@modal').should('be.empty'); // Проверяем, что модальное окно изначально пусто
    cy.get(FILLING_ID).children('a').click(); // Открываем модальное окно
    cy.get('@modal').should('not.be.empty'); // Проверяем, что окно открылось
    cy.get('body').trigger('keydown', { key: 'Escape' }); // Нажимаем клавишу Escape
    cy.get('@modal').should('be.empty'); // Проверяем, что окно закрылось
  });

  it('Закрытие модального окна кликом на оверлей', () => {
    cy.get('@modal').should('be.empty'); // Проверяем, что модальное окно изначально пусто
    cy.get(FILLING_ID).children('a').click(); // Открываем модальное окно
    cy.get('@modal').should('not.be.empty'); // Проверяем, что окно открылось
    cy.get(`[data-cy='overlay']`).click({ force: true }); // Нажимаем на фон (оверлей)
    cy.get('@modal').should('be.empty'); // Проверяем, что окно закрылось
  });
});

// Тест создания заказа
describe('Оформление заказа', () => {
  afterEach(() => {
    // Очищаем состояние браузера после каждого теста
    window.localStorage.clear(); // Удаляем данные локального хранилища
    cy.clearAllCookies(); // Удаляем cookies
    cy.getAllLocalStorage().should('be.empty'); // Проверяем, что локальное хранилище очищено
    cy.getAllCookies().should('be.empty'); // Проверяем, что cookies удалены
  });

  it('Добавление ингредиентов и успешное создание заказа', () => {
    cy.get(BUN_ID_1).children('button').click(); // Добавляем первую булку
    cy.get(FILLING_ID).children('button').click(); // Добавляем начинку

    cy.intercept('POST', '/api/orders').as('createOrder'); // Подменяем запрос создания заказа
    cy.get(`[data-cy='order-button']`).click(); // Нажимаем кнопку оформления заказа

    cy.wait('@createOrder') // Ждём выполнения запроса создания заказа
      .its('response.body')
      .should((body) => {
        expect(body).to.have.property('order'); // Проверяем наличие объекта заказа
        expect(body.order).to.have.property('number', 64315); // Проверяем номер заказа из фикстуры
      });

    cy.get('@modal').find('h2').contains('64315'); // Проверяем, что модальное окно содержит номер заказа
    cy.get('@modal').find('button').click(); // Закрываем модальное окно
    cy.get('@modal').should('be.empty'); // Проверяем, что окно закрылось
  });

  it('Проверка, что конструктор пустой после оформления заказа', () => {
    cy.get('[data-cy="constructor"]').should('contain.text', 'Выберите булки'); // Проверяем текст в области выбора булок
    cy.get('[data-cy="filling-list"]').should(
      'contain.text',
      'Выберите начинку'
    ); // Проверяем текст в области выбора начинок
  });
});
