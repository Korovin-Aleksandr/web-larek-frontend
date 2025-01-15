import { IProduct } from "../types";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { EventEmitter, IEvents } from "./base/events";
import { Component } from "./base/Component";

export class ProductCard extends Component<IProduct> {
  protected descriptionProduct?: HTMLElement;
  protected imageProduct?: HTMLImageElement;
  protected titleProduct: HTMLElement;
  protected categoryProduct?: HTMLElement;
  protected priceProduct: HTMLElement;
  protected idProduct: string;
  protected button?: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events?: IEvents) {
    super(container)

    this.descriptionProduct = container.querySelector('.card__description');
    this.imageProduct = container.querySelector('.card__image');
    this.titleProduct = container.querySelector('.card__title');
    this.categoryProduct = container.querySelector('.card__category');
    this.priceProduct = container.querySelector('.card__price');
    this.button = container.querySelector('.card__button');
    this.events = events;

    this.container.addEventListener('click', () =>
      this.events.emit('product:open', { card: this })
    );
  }

  set title(value: string) {
    this.setText(this.titleProduct, value);
  }

  get title(): string {
    return this.titleProduct.textContent || '';
  }

  set image(value: string) {
    this.setImage(this.imageProduct, value, this.title)
  }

  set category(value: string) {
    this.setText(this.categoryProduct, value);
  }

  get category(): string {
    return this.categoryProduct.textContent || '';
  }

  set price(value: number) {
    if (value === null) {
      this.setText(this.priceProduct, `Бесценно`);
    } else {this.setText(this.priceProduct, `${value} синапсов`);}
  }
    

  get price(): number {
    return Number(this.priceProduct.textContent);
  }

  set id(value: string) {
      this.idProduct = value;
    }

  get id() {
    return this.idProduct;
  }
}