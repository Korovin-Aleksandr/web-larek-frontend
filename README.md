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
  items: IProduct[];
  amountProduct: number;
  total: number;
  adress: string;
  email: string;
  phone: string;
  payment: string;
}
```

Модель для хранения массива карточек продукта

```
export interface ICardsProduct {
  cards: IProduct[]
  preview: string | null;
}
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
- getCard(cardId: string): ICard - возвращает карточку продукта по ее id
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
- constructor(events: IEvents) Конструктор класса принимает инстант брокера событий
В полях класса хранятся следующие данные:
- id: string - уникальный идентификатор
- items: IProduct[] - список продуктов
- amountProduct: number - кол-во продуктов в корзине
- total: number - сумма заказа
- address: string - адресс пользователя
- email: string - почта пользователя
- phone: string - телефон пользователя
- payment: {name: string; label: string;}[] - способ оплаты, который выбирает пользователь
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setOrderInfo(orderData: IOrder) - сохранение данных о заказе
- getOrderInfo(): IOrder - получение данных о заказе
- addProductToBasket(product: IProduct) - добавление продукта в корзину
- deleteProduct(product: IProduct): void - удаление продукта с корзины
- calculationAmountOrder(): number - расчет порядка продуктов в корзине
- calculateTotal(): number - расчет суммы заказа
- indexCounter(): void - присвоение индека продуктам в корзине для взаимодействия с их DOM
- choicePaymentMethod(name: string, label: string): void - выбор способа оплаты
- addUserAdress(adress: string): void - добавление адресса пользователя для доставки
- addUserEmail(email: string): void -добавление почты пользователя 
- addUserTelephone(telephone: string): void - добавление телефона пользователя
- updateOrderInfo() - обновление данных заказа
- resetOrderData(): void - сброс полей заказа
- convertingObject(items: IProduct[]): string[] - преобразовние объекта под стандарт для отправки на сервер

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ModalContainer
Реализует контейнер управления модальным окном. В нем будут отображаться необходимое модальное окна путем добавления класса
Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает HTMLElement модального окна, который будет управляться. При инициализации ищет контейнер модального окна в DOM и устанавливает базовые обработчики событий.

Поля класса:
- modal: HTMLElement — Корневой элемент модального окна
- modalContent: HTMLElement — Элемент для динамического размещения содержимого
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы:
- open(content: HTMLElement): void Открывает модальное окно (добавляя класс modal_active) и заменяет его содержимое на переданный HTML-контент
- close(): void Закрывает модальное окно, удаляя активный класс modal_active
- handleEscUp Закрывает модальное окно по кнопке esc, удаляя активный класс modal_active.

#### Класс BasketIcon
Класс отвечает за отображение кол-ва продуктов в корзине на главной странице
Поля класса:
- basketCounter: HTMLElement - корневой элемент
- buttonBasket: HTMLButtonElement - кнопка корзины
- events: IEvents - кземпляр класса `EventEmitter` для инициации событий при изменении данных.

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- set и get для записи и получения информиции с полей

#### Класс BasketModal 
Класс представляет собой контейнер для собердимого корзины, отображает навание модели (корзина) и сумму заказа, а также кнопку для оформления
Поля класса:
basket: HTMLElement; - корневой элемент
shopingList: HTMLElement; - место для отображения списка продуктов
buttonModal: HTMLButtonElement; кнопка оформить заказ
basketPrice: HTMLElement; - сумма заказа
events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- set и get для записи и получения информиции с полей
- renderBasketItems( items: any[],itemTemplate: HTMLTemplateElement,componentClass: typeof basketItem,) - метот отвечающий за рендер содержимого корзины
- toggleOrderButton - метод деактивации кнопки

#### basketItem
Класс отвечает за отображение списка продуктов в контейнере BasketModal 
Поля класса:
basketItem: HTMLElement; - корневой элемент
basketDeleteItem: HTMLButtonElement; - кнопка удаления
itemTitle: HTMLElement; - заголовок продукта
itemPrice: HTMLElement; - цена продукта
itemId: string; - id продукта
itemIndex: HTMLElement; - индекс продукта для взаимодействия с его DOM
events: IEvents; - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- set и get для записи и получения информиции с полей

#### Класс CardPreviewModal
Класс модельного окна просмотра карточки продукта
Поля класса:
descriptionProduct: HTMLElement - описания продукта
imageProduct: HTMLImageElement - картинка продукта
titleProduct: HTMLElement - заголовок продукта
categoryProduct: HTMLElement - котегория продукта
priceProduct: HTMLElement - цена продукта
idProduct: string -id продукта
protected events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
protected buttonProduct: HTMLButtonElement - кнопка для заказа продукта 

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- set и get для записи и получения информиции с полей
- buttonChange() - изменения текста кнопки

#### Класс BaseModal
Класс является родительским для класса PaymantModal и UserInfoModal и содержит в себе методы работы с волидацией и ее отображанием
Поля класса:
container: HTMLElement - контейнер
events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
errorSpan: HTMLElement - елемент, где отображается ошибка валидации

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- displayError(message: string) - метод показа ошибки валидации
- clearError(): void - метод стирает ошибки валидации
- getInputValues(inputs: NodeListOf<HTMLInputElement>): Record<string, string> - метод получения данных из полей ввода
- setInputValues(inputs: NodeListOf<HTMLInputElement>, data: Record<string, string>): void - метод записи данных в поля ввода
- close() - метод очистки данных класса


#### Класс PaymantModal
Класс отображения модального окна с выбором способа оплаты и указания адреса доставки. Класс включает в себя методы валидации и ее отображения.

Поля класса:
modalTitle: HTMLElement - заголовок модалки
inputs: NodeListOf<HTMLInputElement> - поля ввода
buttons: NodeListOf<HTMLButtonElement> - кнопки выбора способа оплаты
submitButton: HTMLButtonElement - кнопка перехода к следубщему шагу
selectedPaymentMethod: { name: string; label: string } - поля для выблора способа оплаты
events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- initialize() - метод отвечает за исходное состояние полей в классе
- setActiveButton(activeName: string) - метод управления кнопками выбора способа оплаты
- toggleSubmitButton(): void - метот управления управления активации кнопки перехода к следующему шану относительно валидации
- submitOrderData()  - метот отправки данных в объект и перехода к следующему шагу
- close() - метод очистки данных класса

#### Класс UserInfoModal
Класс отображения модального окна с вводом информации о пользователе (почта и телефон). Класс включает в себя методы валидации и ее отображения.

Поля класса:
inputs: NodeListOf<HTMLInputElement> - поля ввода
buttonSubmit: HTMLButtonElement - кнопка отправки данных заказа на сервер и перехода к следующему окно в случае успеха
events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- initialize() - метод отвечает за исходное состояние полей в классе
- setActiveButton(activeName: string) - метод управления кнопками выбора способа оплаты
- toggleSubmitButton(): void - метот управления управления активации кнопки перехода к следующему шану относительно валидации
- submitOrderData()  - метот отправки данных в объект и перехода к следующему шагу
- close() - метод очистки данных класса

#### Класс SuccessModal
Класс отображания модального окна успешного оформления заказа

Поля класса:
title: HTMLElement - заголовок
orderDescription: HTMLElement - описание 
button: HTMLButtonElement - кнопка завершения
events: IEvents -экземпляр класса `EventEmitter` для инициации событий при изменении данных.

- constructor(templateId: string, events: IEvents) - конструктор принимает HTMLElement и инстант брокера событий

Методы:
- set и get для записи и получения информиции с полей

#### Класс ProductCard
Отвечает за отображение карточки продукта, задавая в карточке данные названия продукта, изображения, категория товаров, 
цену, описание. Класс используется для отображения карточек на странице сайта. 
- constructor(templateId: string, events: IEvents) Принимает ID HTML-шаблона и инстант брокера событий
Поля класса содержат элементы разметки элементов карточки
Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий
для отображения товара в отдельном модальном окне

Методы:
- set и get для записи и получения информации полей объекта

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
- `product:open` - открытие модального окна с карточкой товара
- `basket:open` - открытие корзины
- `product:add` - выбор продукта добавление его в корзину
- `basket-item:delete` - удаление продуктов с корзины по отдельности
- `basket:update` - обновление данных корзины
- `paymant:open` - открытие модалки с способом оплаты и вводом адреса доставки
- `payment-address:submit` - запись данных в объект orderData (адрес и способ оплаты)
- `userInfo:open` - открытие модалки с информацией о пользователе (телефон и почта)
- `order:submit` - запись данных в объект orderData (телефонб и почта)
- `order:sending` - отпрвка данных заказа на сервер
- `success-modal:open` - открытие модалки с успехом
- `success-modal:close` - закрытие модалки с успехом