
import { TUserData } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export class UserInfoModal extends Component<TUserData> {
  protected _form: HTMLFormElement;
  protected formName: string;
  protected inputs: NodeListOf<HTMLInputElement>;
  protected buttonSubmit: HTMLButtonElement;
  protected events: IEvents;

  constructor(conteiner: HTMLElement, events: IEvents) {
    super(conteiner)
    this.events = events;
    this._form =this.container.querySelector('.form');
    this.inputs =
      this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.buttonSubmit = conteiner.querySelector('.button')

    this.buttonSubmit.addEventListener('click', () => {
      this.submitOrderData();
    })
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

  submitOrderData() {
    const inputValues = this.getInputValues();
    const email = inputValues.email;
    const phone = inputValues.phone;

    this.events.emit('order:submit', { email, phone,
    });
  }
}