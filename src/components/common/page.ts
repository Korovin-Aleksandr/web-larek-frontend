import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPage {
	productList: any[];
	count: number;
}

export class Page extends Component<IPage>{
  protected basketCounter: HTMLElement;
  protected buttonBasket: HTMLButtonElement;
  gallery: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.basketCounter = container.querySelector('.header__basket-counter');
    this.buttonBasket = container.querySelector('.header__basket');
    this.gallery = container.querySelector('.gallery');

    this.buttonBasket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
  }

  set count(count: number) {
		this.setText(this.basketCounter, count);
	}

	get count() {
		return parseInt(this.basketCounter.textContent || '0', 10);
	}
}