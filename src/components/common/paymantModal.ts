import { TPaymentMethods } from './../../types/index';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';



export class PaymantModal extends Component<TPaymentMethods> {
  protected modalTitle: HTMLElement;
  protected inputs: NodeListOf<HTMLInputElement>;
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected errorSpan: HTMLElement;
  protected submitButton: HTMLButtonElement;
  selectedPaymentMethod: { name: string; label: string };
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.modalTitle = container.querySelector('.modal__title');
    this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.buttons = this.container.querySelectorAll<HTMLButtonElement>('.button_alt');
    this.submitButton = container.querySelector('.order__button');
    this.errorSpan = container.querySelector('.form__errors');
    this.selectedPaymentMethod = null;

    this.initialize();
  }

  initialize() {
    this.submitButton.disabled = true;

    this.submitButton.addEventListener('click', () => {
      this.submitOrderData();
    });

    this.inputs.forEach((input) => {
      input.addEventListener('input', () => this.toggleSubmitButton());
    });

    this.buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const paymentMethod = (event.target as HTMLButtonElement).name;
        const paymentLabel = button.textContent || '';
        this.selectedPaymentMethod = { name: paymentMethod, label: paymentLabel };
        this.setActiveButton(paymentMethod);
        this.toggleSubmitButton();
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
    this.toggleSubmitButton();
  }

  setActiveButton(activeName: string) {
    this.buttons.forEach((button) => {
      if (button.name === activeName) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  displayError(message: string): void {
    if (this.errorSpan) {
      this.errorSpan.textContent = message;
    }
  }

  clearError(): void {
    if (this.errorSpan) {
      this.errorSpan.textContent = '';
    }
  }

  toggleSubmitButton(): void {
    this.clearError();

    if (!this.selectedPaymentMethod) {
      this.displayError('Выберите способ оплаты');
      this.submitButton.disabled = true;
      return;
    }

    const inputValues = this.getInputValues();
    if (!inputValues.address.trim()) {
      this.displayError('Пожалуйста, введите адрес');
      this.submitButton.disabled = true;
      return;
    }

    this.submitButton.disabled = false;
  }

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

  close() {
		this.inputs.forEach((input) => {
      input.value = '';
    });
    this.selectedPaymentMethod = null;
    this.buttons.forEach((button) => {
      button.classList.remove('button_alt-active');
    });
    this.clearError();
    this.submitButton.disabled = true;
  }
}
