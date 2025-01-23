import './scss/styles.scss';

import { ProductData} from './components/productData';
import { EventEmitter,} from './components/base/events';
import { ensureElement, cloneTemplate } from "./utils/utils";
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCard } from './components/ProductCard';
import { AuctionAPI } from './components/AppApi';
import { ModalContainer } from './components/common/modalContainer';
import { CardPreviewModal } from './components/common/cardPreviewModal';
import { BasketModal, BasketItem} from './components/common/basketModal';
import { OrderData } from './components/orderData';
import { UserInfoModal } from './components/common/userInfoModel';
import { SuccessModal } from './components/common/successModal';
import { PaymentModal } from './components/common/paymantModal';
import { Page } from './components/common/page';


const events = new EventEmitter();
const productsData = new ProductData(events);
const api = new AuctionAPI(CDN_URL, API_URL);
const modal = new ModalContainer(document.querySelector('#modal-container'), events);
const orderData = new OrderData(events);
const page = new Page(document.querySelector('.page'), events);


//Темплейты
const cardListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketModalTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymantTemplate = ensureElement<HTMLTemplateElement>('#order')
const userInfoTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success')


const basketModal = new BasketModal(cloneTemplate(basketModalTemplate), events);
const paymantModal = new PaymentModal(cloneTemplate(paymantTemplate), events);
const userInfoModal = new UserInfoModal(cloneTemplate(userInfoTemplate), events);
const successModal = new SuccessModal(cloneTemplate(successTemplate), events)

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})
//получение массива карточек
api.getLotList()
  .then((products) => {
    productsData.cards = products;

    products.forEach((product) => {
      const clonedTemplate = cloneTemplate(cardListTemplate); 
      const card = new ProductCard(clonedTemplate, events); 
      page.gallery.append(card.render(product)); 
    });
  })
  .catch((err) => {
    console.error(err);
  });

//открыие карточки продукта
events.on('product:open', (data: { card: ProductCard}) => {
  const { card } = data;
  const {description, title, image, category, price} = productsData.getCard(card.id);
  const cardPreview = new CardPreviewModal(cloneTemplate(cardPreviewTemplate), events);
  cardPreview.prewiew = {
    description: description,
    image: image,
    title: title,
    category: category,
    price: price,
    id: card.id
  };

  const isInBasket = orderData.items.some((item) => item.id === card.id);
  if (isInBasket) {
    cardPreview.buttonChange();
  }
  modal.modalContent.append(cardPreview.render());
  modal.open();
});

//открытие корзины
events.on('basket:open', () =>{
  
  basketModal.renderBasketItems(
    orderData.items,
    basketItemTemplate,
    BasketItem
  );
  modal.modalContent.append(basketModal.render());
  modal.open();
})

//добавление продукта в корзину
events.on('product:add', (data: { card: CardPreviewModal }) => {
  const { prewiew } = data.card;
  orderData.addProductToBasket({
    id: prewiew.id,
    title: prewiew.title,
    price: prewiew.price,
  });
  modal.close();
});

//удаление продукта из корзины
events.on('basket-item:delete', (data: { id: string }) => {
  const { id } = data;
  const productToDelete = orderData.items.find((item) => item.id === id);
  if (productToDelete) {
    orderData.deleteProduct(productToDelete);
  }
  basketModal.renderBasketItems(
    orderData.items,
    basketItemTemplate,
    BasketItem
  );
});

//обновление информации в корзине
events.on('basket:update', (data: { amount: number, total: number}) => {
  page.count = data.amount;
  basketModal.order = data.total;
  
});

//открытие модального окна выбора способа оплаты и ввода адреса
events.on('paymant:open', () => {
  modal.close();
  modal.modalContent.append(paymantModal.render());
  
  modal.open()
})

//запись адреса и способа оплаты
events.on('payment-address:submit', (data: { address: string; paymentMethod: { name: string; label: string } }) => {
  const { address, paymentMethod } = data;
  orderData.addUserAdress(address);
  orderData.choicePaymentMethod(paymentMethod.name, paymentMethod.label);
});

//открытие модального окна ввода контактных данных
events.on('userInfo:open', () => {
  modal.close();
  modal.modalContent.append(userInfoModal.render());
  modal.open()
})

//запись контактных данных
events.on('order:submit', (data: { email: string, phone: string}) =>{
  const {email, phone } = data
  orderData.addUserTelephone(phone);
  orderData.addUserEmail(email);
  events.emit('order:sending');
})

//отправка заказа на сервер
events.on('order:sending', async () => {
  try {
    successModal.orderTotal = { total: orderData.total };

    orderData.items = orderData.convertingObject(orderData.items);
    await api.postOrder(orderData);

    orderData.resetOrderData();
    paymantModal.close();
    userInfoModal.close();
    events.emit('basket:update', { amount: 0, total: 0 });
    events.emit('success-modal:open');
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
  }
});

//открытие модального окна успеха
events.on('success-modal:open', () => {
  modal.close();
  modal.modalContent.append(successModal.render());
  modal.open()
  
})

//закрытие модального окна успеха
events.on('success-modal:close', () => {
  modal.close();
})