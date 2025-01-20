import { IOrder, TUserData } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export class SuccessModal extends Component<IOrder> {
  protected title: HTMLElement;
  protected orderDescription: HTMLElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events;
    this.title = container.querySelector('.order-success__title');
    this.orderDescription = container.querySelector('.order-success__description');
    this.button = container.querySelector('.button');

    this.button.addEventListener('click', () => {
      this.events.emit('success-modal:close');
    });
  }

  set orderTotal({total}: {total: number}) {
    this.orderDescription.textContent = `Списано ${total} синапсов`;
 }

 get orderTotal() {
  return {total: parseFloat(this.orderDescription.textContent?.replace(/\D+/g, '') || '0'),
 }}
}