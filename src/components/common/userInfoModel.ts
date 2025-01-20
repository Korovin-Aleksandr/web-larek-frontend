import { TUserData } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export class UserInfoModal extends Component<TUserData> {
  protected inputs: NodeListOf<HTMLInputElement>;
  protected buttonSubmit: HTMLButtonElement;
  protected errorSpan: HTMLElement;
  protected events: IEvents;

  constructor(conteiner: HTMLElement, events: IEvents) {
    super(conteiner)
    this.events = events;
    this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.buttonSubmit = conteiner.querySelector('.button')
    this.errorSpan = conteiner.querySelector('.form__errors');

    this.initialize();
  }

  initialize() {
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
    const inputValues = this.getInputValues();

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

  submitOrderData() {
    const inputValues = this.getInputValues();
    const email = inputValues.email;
    const phone = inputValues.phone;

    this.events.emit('order:submit', { email, phone,
    });
  }

  close() {
		this.inputs.forEach((input) => {
      input.value = '';
    });
    this.clearError();
    this.buttonSubmit.disabled = true;
  }
}