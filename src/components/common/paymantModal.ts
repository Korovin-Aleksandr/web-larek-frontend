import { extend } from 'validate.js';
import { TPaymentMethods } from './../../types/index';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


export class PaymantModal extends Component<TPaymentMethods> {
  protected _form: HTMLFormElement;
  protected errors: Record<string, HTMLElement>;
  protected formName: string;
  protected modalTitle: HTMLElement;
  protected inputs: NodeListOf< HTMLInputElement >;
  protected buttons: NodeListOf< HTMLButtonElement >;
  protected submitButton: HTMLButtonElement;
  protected selectedPaymentMethod: { name: string; label: string } | null;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.modalTitle = container.querySelector('.modal__title');
    this._form = this.container.querySelector('.form');
    // this.formName = this._form.getAttribute('name');
    this.inputs =
      this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.buttons = 
      this.container.querySelectorAll<HTMLButtonElement>('.button');
    this.submitButton = container.querySelector('.order__button');
    this.selectedPaymentMethod = null;

    this.submitButton.addEventListener('click', () => {
      this.submitOrderData();
    });

    this.buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const paymentMethod = (event.target as HTMLButtonElement).name;
        const paymentLabel = button.textContent || '';
        this.selectedPaymentMethod = { name: paymentMethod, label: paymentLabel };
        this.setActiveButton(paymentMethod);
      });
    });
  }
  
  protected getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

  set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

  setActiveButton(activeName: string) {
    // Устанавливаем активное состояние для кнопок
    this.buttons.forEach((button) => {
      if (button.name === activeName) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });}
    
    submitOrderData() {
    const inputValues = this.getInputValues();
    const address = inputValues.address;

    const { name: paymentName, label: paymentLabel } = this.selectedPaymentMethod;
    this.events.emit('payment-address:submit', {
      address,
      paymentMethod: { name: paymentName, label: paymentLabel },
    });
    this.events.emit('userInfo:open');
  }
}
