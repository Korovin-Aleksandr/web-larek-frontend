import { IOrder, IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { OrderData } from "../orderData";
import { CardPreviewModal } from "./cardPreviewModal";


export class BasketModal extends Component<IOrder> {
  protected basket: HTMLElement;
  shopingList: HTMLElement;
  protected buttonModal: HTMLButtonElement;
  protected basketPrice: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events
    this.basket = container.querySelector('.basket')
    this.shopingList = container.querySelector('.basket__list');
    this.buttonModal = container.querySelector('.button');
    this.basketPrice = container.querySelector('.basket__price');

    this.buttonModal.addEventListener('click', () => {
      this.events.emit('');
    });
  }

  set order ({total}: IOrder) {
    this.basketPrice.textContent = `${total} синапсов`;
    // this.basketCounter.textContent = `${total}`;
  }

  updateBasketInfo() {
    const total = this.calculateTotal();
    this.basketPrice.textContent = `${total} синапсов`;
  }

  calculateTotal(): number {
    return Array.from(this.shopingList.children).reduce((total, item) => {
      const price = parseFloat((item.querySelector('.card__price') as HTMLElement).textContent?.replace(/\D+/g, '') || '0');
      return total + price;
    }, 0);
  }
  
  renderBasketItems( // Рендерим в корзину
    items: any[],  // Массив элементов 
    itemTemplate: HTMLTemplateElement, // Шаблон для рендеринга 
    componentClass: typeof basketItem,
  ) {
    this.shopingList.innerHTML = '';
    items.forEach((itemData) => {
      const itemComponent = new componentClass(cloneTemplate(itemTemplate), this.events);
      if (itemComponent instanceof basketItem) {
        itemComponent.prewiew = {
          title: itemData.title,
          price: itemData.price,
          id: itemData.id,
        };
      }
      this.shopingList.append(itemComponent.render());
    });
    this.updateBasketInfo();
  }

}

export class basketItem extends Component<CardPreviewModal> {
  basketItem: HTMLElement;
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
      this.events.emit('basket-item:delete', { id: this.itemId });
    });
  }

  set prewiew ({title, price, id}: {title: string, price: number, id: string}) {
    this.itemTitle.textContent = title;
    this.itemPrice.textContent = `${price} синапсов`;
    this.itemId = id;

  }

  get prewiew() {
    return {
      title: this.itemTitle.textContent || '',
      price: parseFloat(this.itemPrice.textContent?.replace(/\D+/g, '') || '0'),
      id: this.itemId || '',
      
    };
  }
}