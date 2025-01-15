import { IOrder, IProduct } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { CardPreviewModal } from "./cardPreviewModal";


export class BasketModal extends Component<IOrder> {
  protected basket: HTMLElement;
  
  constructor(container: HTMLElement) {
    super(container)
    this.basket = container.querySelector('.basket')
  }
  
}

export class basket extends Component<IOrder> {
  shopingList: HTMLElement;
  protected buttonModal: HTMLButtonElement;
  protected basketPrice: HTMLElement;
  protected basketCounter: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events
    this.shopingList = container.querySelector('.basket__list');
    this.buttonModal = container.querySelector('.button');
    this.basketPrice = container.querySelector('.basket__price');
    this.basketCounter = document.querySelector('.basket__counter');

    this.buttonModal.addEventListener('click', () => {
      this.events.emit('');
    });
  }

  set order ({total}: IOrder) {
    this.basketPrice.textContent = `${total} синапсов`;
  }
}

interface IBasketItem {
  item : {
      title: string;
      price: number;
      id: string
  }
}

export class basketItem extends Component<CardPreviewModal> {
  protected basketItem: HTMLElement;
  protected basketDeleteItem: HTMLButtonElement;
  protected itemTitle: HTMLElement;
  protected itemPrice: HTMLElement;
  protected itemId: string;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events
    this.basketItem = container.querySelector('.basket__item');
    this.itemTitle = container.querySelector('.card__title');
    this.itemPrice = container.querySelector('.card__price');
    this.basketDeleteItem = container.querySelector('.basket__item-delete');

    this.basketDeleteItem.addEventListener('click', () => {
      this.events.emit('basket-item:delete');
    });
  }

  set prewiew ({title, price, id}: {title: string, price: number, id: string}) {
    this.itemTitle.textContent = title;
    this.itemPrice.textContent = `${price} синапсов`;
    this.itemId = id;
    
  }
}