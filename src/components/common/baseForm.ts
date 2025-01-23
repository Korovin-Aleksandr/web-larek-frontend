import { IOrder } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class BaseForm extends Component<IOrder> {
	protected container: HTMLElement;
	protected events: IEvents;
	protected errorSpan: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.container = container;
		this.events = events;
		this.errorSpan = container.querySelector('.form__errors');
	}

	displayError(message: string): void {
		if (this.errorSpan) {
			this.setText(this.errorSpan, message);
		}
	}

	clearError(): void {
		if (this.errorSpan) {
			this.setText(this.errorSpan, '');
		}
	}

	protected getInputValues(
		inputs: NodeListOf<HTMLInputElement>
	): Record<string, string> {
		const valuesObject: Record<string, string> = {};
		inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	protected setInputValues(
		inputs: NodeListOf<HTMLInputElement>,
		data: Record<string, string>
	): void {
		inputs.forEach((element) => {
			element.value = data[element.name] || '';
		});
	}

	close(inputs: NodeListOf<HTMLInputElement>, resetState?: () => void): void {
		inputs.forEach((input) => {
			input.value = '';
		});
		this.clearError();
		if (resetState) {
			resetState();
		}
	}
}
