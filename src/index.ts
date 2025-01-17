import { PaymantModal } from './components/common/paymantModal';
import './scss/styles.scss';

import { IProduct, IOrder, IOrderData, IApi } from './types/index';
import { ProductData} from './components/productData';
import { EventEmitter, IEvents } from './components/base/events';
import {ensureElement, cloneTemplate} from "./utils/utils";
import { API_URL, settings, CDN_URL } from './utils/constants';
import {ProductCard} from './components/ProductCard';
import { AuctionAPI } from './components/AppApi';
import { Component } from './components/base/Component';
import { ModalContainer } from './components/common/modalContainer';
import { CardPreviewModal } from './components/common/cardPreviewModal';
import { BasketModal, basketItem } from './components/common/basketModal';
import { OrderData } from './components/orderData';
import { BasketIcon } from './components/common/basketIcon';
import { UserInfoModal } from './components/common/userInfoModel';

const events = new EventEmitter();
const productsData = new ProductData(events);
const api = new AuctionAPI(CDN_URL, API_URL);
const modal = new ModalContainer(document.querySelector('#modal-container'), events);
const orderData = new OrderData(events);
const basketIcon = new BasketIcon(document.querySelector('.header__container'), events);


//Темплейты
const cardListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketModalTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymantTemplate = ensureElement<HTMLTemplateElement>('#order')
const userInfoTemplate = ensureElement<HTMLTemplateElement>('#contacts')

const basketModal = new BasketModal(cloneTemplate(basketModalTemplate), events);
const paymantModal = new PaymantModal(cloneTemplate(paymantTemplate), events);
const userInfoModal = new UserInfoModal(cloneTemplate(userInfoTemplate), events);

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})
// 
api.getLotList()
  .then((products) => {
    productsData.cards = products;
    const  cardSection = document.querySelector('.gallery');

    products.forEach((product) => {
      const clonedTemplate = cloneTemplate(cardListTemplate); 
      const card = new ProductCard(clonedTemplate, events); 
      cardSection.append(card.render(product)); 
    });
  })
  .catch((err) => {
    console.error(err);
  });


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

  const isInBasket = orderData.shopingList.some((item) => item.id === card.id);
  if (isInBasket) {
    cardPreview.buttonChange();
  }
  modal.modalContent.append(cardPreview.render());
  modal.open();
});

events.on('basket:open', () =>{
  
  basketModal.renderBasketItems(
    orderData.shopingList,
    basketItemTemplate,
    basketItem 
  );
  modal.modalContent.append(basketModal.render());
  modal.open();
})

events.on('product:add', (data: { card: CardPreviewModal }) => {
  const { prewiew } = data.card;
  // Добавляем товар в объект OrderData
  orderData.addProductToBasket({
    id: prewiew.id,
    title: prewiew.title,
    price: prewiew.price,
  });
  modal.close();
  console.log(orderData);
});


events.on('basket-item:delete', (data: { id: string }) => {
  const { id } = data;
  // Удаляем товар из объекта OrderData
  const productToDelete = orderData.shopingList.find((item) => item.id === id);
  if (productToDelete) {
    orderData.deleteProduct(productToDelete);
  }
  basketModal.renderBasketItems(
    orderData.shopingList,
    basketItemTemplate,
    basketItem 
  );
});

events.on('basket:update', (data: { amount: number, total: number}) => {
  basketIcon.count = data.amount;
  basketModal.order = data.total;
});

events.on('paymant:open', () => {
  modal.close();
  modal.modalContent.append(paymantModal.render());
  modal.open()
})

events.on('payment-address:submit', (data: { address: string; paymentMethod: { name: string; label: string } }) => {
  const { address, paymentMethod } = data;
  orderData.addUserAdress(address);
  orderData.choicePaymentMethod(paymentMethod.name, paymentMethod.label);
});

events.on('userInfo:open', () => {
  modal.close();
  modal.modalContent.append(userInfoModal.render());
  modal.open()
})

events.on('order:submit', (data: { email: string, phone: string}) =>{
  const {email, phone } = data
  orderData.addUserTelephone(phone);
  orderData.addUserEmail(email);
  console.log(orderData);
})