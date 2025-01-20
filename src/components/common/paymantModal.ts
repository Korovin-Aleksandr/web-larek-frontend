import { IEvents } from '../base/events';
import { BaseModal } from './baseModal';



export class PaymentModal extends BaseModal{
  protected modalTitle: HTMLElement;
  protected inputs: NodeListOf<HTMLInputElement>;
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected submitButton: HTMLButtonElement;
  selectedPaymentMethod: { name: string; label: string };

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.modalTitle = container.querySelector('.modal__title');
    this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.buttons = this.container.querySelectorAll<HTMLButtonElement>('.button_alt');
    this.submitButton = container.querySelector('.order__button');
    this.selectedPaymentMethod = null;

    this.initialize();
  }

  initialize(): void {
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

  setActiveButton(activeName: string): void {
    this.buttons.forEach((button) => {
      if (button.name === activeName) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  toggleSubmitButton(): void {
    this.clearError();

    if (!this.selectedPaymentMethod) {
      this.displayError('Выберите способ оплаты');
      this.submitButton.disabled = true;
      return;
    }

    const inputValues = this.getInputValues(this.inputs);
    if (!inputValues.address.trim()) {
      this.displayError('Пожалуйста, введите адрес');
      this.submitButton.disabled = true;
      return;
    }

    this.submitButton.disabled = false;
  }

  submitOrderData(): void {
    const inputValues = this.getInputValues(this.inputs);
    const address = inputValues.address;

    const { name: paymentName, label: paymentLabel } = this.selectedPaymentMethod;
    this.events.emit('payment-address:submit', {
      address,
      paymentMethod: { name: paymentName, label: paymentLabel },
    });
    this.events.emit('userInfo:open');
  }

  close(): void {
    super.close(this.inputs, () => {
      this.selectedPaymentMethod = null;
      this.buttons.forEach((button) => {
        button.classList.remove('button_alt-active');
      });
      this.submitButton.disabled = true;
    });
  }
}

