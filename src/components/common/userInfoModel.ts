import { IEvents } from "../base/events";
import { BaseModal } from "./baseModal";


export class UserInfoModal extends BaseModal {
  protected inputs: NodeListOf<HTMLInputElement>;
  protected buttonSubmit: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.buttonSubmit = container.querySelector('.button');

    this.initialize();
  }

  initialize(): void {
    this.buttonSubmit.disabled = true;

    this.buttonSubmit.addEventListener('click', () => {
      this.submitOrderData();
    });

    this.inputs.forEach((input) => {
      input.addEventListener('input', () => this.toggleSubmitButton());
    });
  }

  toggleSubmitButton(): void {
    this.clearError();
    const inputValues = this.getInputValues(this.inputs);

    if (!inputValues.email.trim()) {
      this.displayError('Пожалуйста, введите email');
      this.buttonSubmit.disabled = true;
      return;
    }

    if (!inputValues.phone.trim()) {
      this.displayError('Пожалуйста, введите телефон');
      this.buttonSubmit.disabled = true;
      return;
    }

    this.buttonSubmit.disabled = false;
  }

  submitOrderData(): void {
    const inputValues = this.getInputValues(this.inputs);
    const { email, phone } = inputValues;

    this.events.emit('order:submit', { email, phone });
  }

  close(): void {
    super.close(this.inputs, () => {
      this.buttonSubmit.disabled = true;
    });
  }
}
