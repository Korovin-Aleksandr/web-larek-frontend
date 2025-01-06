https://github.com/Korovin-Aleksandr/web-larek-frontend.git

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемых в приложении

Карточка продукта 

```
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```

Двнные заказа

```
export interface IOrder {
  id: string;
  shopingList: IProduct[];
  amountProduct: number;
  total: number;
  adress: string;
  email: string;
  telephone: string;
  paymentMethods: string;
}
```

Модель для хранения массива карточек продукта

```
export interface ICardsProduct {
  cards: IProduct[]
  preview: string | null;
}
```

Данные используемые в корзине

```
export type TBasket = Pick<IOrder, 'id' | 'shopingList' | 'total' | 'amountProduct'>;
```

Данные модального окна способа оплаты

```
export type TPaymentMethods = Pick<IOrder, 'paymentMethods' | 'adress'>;
```

Данные пользователя

```
export type TUserData = Pick<IOrder, 'email' | 'telephone' | 'adress'>;
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. 
`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse` - Метод принимает объект response типа Response, который представляет ответ от сервера (например, результат вызова fetch).


#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - снять обработчик с события
- `emit` - инициализация события
- `onAll` - слушать все события
- `offAll`- сбросить все обработчики
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductsData
Класс отвечает за хранение и логику работы с данными карточек продукта.\
- constructor(events: IEvents) Конструктор класса принимает инстант брокера событий
В полях класса хранятся следующие данные:
- cards: IProduct[] - массив объектов карточек продуктов
- preview: string | null - id карточки продукта, выбранной для просмотра в модальной окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- getProductList(): IProduct[] - получение массива карточек продукта с сервера
- addProductToBasket(product: IProduct): void - добавление продукта в корзину

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
- constructor(events: IEvents) Конструктор класса принимает инстант брокера событий
В полях класса хранятся следующие данные:
- id: string - уникальный идентификатор
- shopingList: IProduct[] - список продуктов
- amountProduct: number - кол-во продуктов в корзине
- total: number - сумма заказа
- address: string - адресс пользователя
- email: string - почта пользователя
- telephone: string - телефон пользователя
- paymentMethods: {name: string; label: string;}[] - способ оплаты, который выбирает пользователь
- result: boolean - результат оформления заказа
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- deleteProduct(product: IProduct): void - удаление продукта с корзины
- countingProducts(shopingList: IProduct[]): number - подсчет кол-ва продуктов в корзине
- calculationAmountOrder(shopingList: IProduct[]): number - расчет суммы стоимости продуктов в корзине
- choicePaymentMethod(name: string, label: string): void - выбор способа оплаты
- addUserAdress(adress: string): void - добавление адресса пользователя для доставки
- addUserEmail(email: string): void -добавление почты пользователя 
- addUserTelephone(telephone: string): void - добавление телефона пользователя
- checkValidation(data: Record<keyof TUserData, string>): boolean - проверяет объект с данными пользователя на валидность
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ModalContainer
Реализует контейнер управления модальным окном. В нем будут отображаться необходимое модальное окна путем добавления класса `modal_active` 
Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
- constructor(modalId: string) Конструктор принимает ID элемента модального окна, который будет управляться. При инициализации ищет контейнер модального окна в DOM и устанавливает базовые обработчики событий.

Поля класса:
- modalContainer: HTMLElement — Корневой элемент модального окна
- modalContent: HTMLElement — Элемент для динамического размещения содержимого
- closeButton: HTMLElement — Кнопка закрытия модального окна

Методы:
- open(content: HTMLElement): void Открывает модальное окно (добавляя класс modal_active) и заменяет его содержимое на переданный HTML-контент
- close(): void Закрывает модальное окно, удаляя активный класс modal_active
- setContent(content: HTMLElement): void Устанавливает содержимое модального окна. Удаляет предыдущее содержимое и добавляет новое.

#### Класс TemplateModal
Представляет собой контейнер из templateElement который будет отображать элементы модального окна (окно с информацие о продукте, корзина и окно с результатом)
- constructor(templateId: string, itemTemplateId: string) - Конструктор принимает ID элемнта с HTML для отображения контейнера корзины и продуктов ней

Поля класса:
- templateElement: HTMLElement – Корневой элемент корзины, куда добавляются товары
- items: Array<IProduct> – Список товаров в корзине
- itemTemplate: HTMLTemplateElement – Темплейт для отображения отдельных товаров
- total: number – Общая сумма товаров в корзине
- buttonModal: HTMLElement – кнопка для работы с модальным окном

Методы:
- deleteProduct(productId: string): void Удаляет товар из корзины по его ID
- calculationAmountOrder(): number Пересчитывает общую стоимость товаров в корзине
- render(): HTMLElement Генерирует DOM-элемент корзины с товарами и возвращает его для отображения
- clear(): void Очищает корзину, удаляя все товары

#### Класс FormModal
Представляет собой контейнер из templateElement в котором будет отображаться данные 
о заказе. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. 
Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.
-constructor(templateId: string) Принимает ID HTML-шаблона, содержащего структуру формы 
оформления заказа. 
Поля класса:
- paymentMethodsElement: HTMLElement – Корневой элемент корзины, куда добавляются товары
- paymentButtons: NodeListOf<HTMLButtonElement> Список кнопок выбора способа оплаты. 
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов
- buttonModal: HTMLElement – кнопка для работы с модальным окном
- submitButton: HTMLButtonElement - кнопка обработки формы

Методы:
- render(): HTMLElement Возвращает полностью сгенерированный DOM-элемент формы.
- setPaymentMethod(paymentMethod: string): void Устанавливает выбранный способ оплаты и обновляет состояние кнопок.
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError (field: string): void - очищает текст ошибки под указанным полем ввода
- close (): void - очищает поля формы и деактивируя кнопку для переклбчения на следующий шаг
- get form: HTMLElement - геттер для получения элемента формы

#### Класс Card
Отвечает за отображение карточки продукта, задавая в карточке данные названия продукта, изображения, категория товаров, 
цену, описание. Класс используется для отображения карточек на странице сайта. 
- constructor(templateId: string) Принимает ID HTML-шаблона
Поля класса содержат элементы разметки элементов карточки
Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий
для отображения товара в отдельном модальном окне

Методы:
- setData(cardData: IProduct): void - заполняет атрибуты элементов карточки данными
- render(): HTMLElement - метод возвращает полностью заполненную карточку
- геттер id возвращает уникальный id карточки

#### Класс ProductList
Отвечает за отображение блока с карточками на главной странице. Предоставляет метод `addProduct(productElement: HTMLElement)` 
для добавления карточек продуктов на страницу. 
- constructor(container: HTMLElement)В конструктор принимает контейнер, в котором размещаются карточки.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
- `product:add` - выбор продукта добавление его в корзину
- `basket-item:delete` - удаление продуктов с корзины по отдельности
- `product:open` - открытие модального окна с карточкой товара
- `basket:open` - открытие корзины
- `basket:event` - событие при нажатие кнопки оформить
- `paymentMethods:select` - выбор способа оплаты
- `address:input` - внесение данных адреса для доставки
- `email:input` - внесение данных почты покупателя
- `telephone:input` - внесение данных телефона пользователя
- `form:submit` - событие обработки формы
- `address:validation` - событие, сообщающее о необходимости валидации формы адреса доставки
- `email:validation` - событие, сообщающее о необходимости валидации формы почты покупателя
- `telephone:validation` - событие, сообщающее о необходимости валидации формы телефона покупателя