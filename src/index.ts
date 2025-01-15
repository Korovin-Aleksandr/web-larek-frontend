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
import { basket, BasketModal, basketItem } from './components/common/basketModal';

const events = new EventEmitter();
const productsData = new ProductData(events);
const api = new AuctionAPI(CDN_URL, API_URL);
const modal = new ModalContainer(document.querySelector('#modal-container'), events);

//Темплейты
const cardListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketModalTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketButton = document.querySelector('.header__basket');

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})
// 
api.getLotList()
  .then((products) => {
    productsData.cards = products;
    const  cardSection = document.querySelector('.gallery');

    products.forEach((product) => {
      const clonedTemplate = cloneTemplate(cardListTemplate); // Клонируем шаблон
      const card = new ProductCard(clonedTemplate, events); // Создаём карточку
      cardSection.append(card.render(product)); // Рендерим карточку с данными
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
  modal.modalContent.append(cardPreview.render());
  modal.open();
  
});

basketButton.addEventListener('click', () =>{
  events.emit('basket:open')
})
const basketModal = new basket(cloneTemplate(basketModalTemplate), events);

events.on('basket:open', () =>{
  modal.modalContent.append(basketModal.render());
  modal.open()
})

events.on('product:add', (data: { card: CardPreviewModal}) => {
  const {prewiew }= data.card;
  const itemBasket = new basketItem(cloneTemplate(basketItemTemplate), events);
  itemBasket.prewiew = {
    title: prewiew.title, 
    price: prewiew.price,
    id: prewiew.id
  }; 
  basketModal.shopingList.append(itemBasket.render());
  modal.close(); 
});
