import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class ModalContainer<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;
	modalContent: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.modalContent = container.querySelector('.modal__content');

		const closeButtonElement = this.container.querySelector('.modal__close');
		closeButtonElement.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		document.body.style.overflow = 'hidden';
		document.addEventListener('keyup', this.handleEscUp);
	}
	close() {
		this.toggleClass(this.container, 'modal_active', false);
		document.removeEventListener('keyup', this.handleEscUp);
		document.body.style.overflow = '';
		this.modalContent.innerHTML = '';
	}

	handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
}
