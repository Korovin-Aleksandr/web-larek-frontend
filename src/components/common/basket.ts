import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketIcon {
  productList: any[]
  count: number;
}

export class BasketIcon extends Component<IBasketIcon> {
  protected basketCounter: HTMLElement
  protected buttonBasket: HTMLButtonElement
  protected events: IEvents
  constructor(container : HTMLElement, events: IEvents) {
    super(container)
    this.events = events
    this.basketCounter = container.querySelector('.header__basket-counter');
    this.buttonBasket = container.querySelector('.header__basket');

    this.buttonBasket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });

    this.events.on('basket:update', (data: { amount: number }) => {
      this.count = data.amount;
    });
  }

  set count(count: number) {
    this.basketCounter.textContent = `${count}`;
  }

  get count() {
    return parseInt(this.basketCounter.textContent || '0', 10);
}
}