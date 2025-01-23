import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ICardPreviewModal {
	prewiew: {
		description: string;
		image: string;
		title: string;
		category: string;
		price: number;
		id: string;
	};
}

export class CardPreviewModal extends Component<ICardPreviewModal> {
	protected descriptionProduct: HTMLElement;
	protected imageProduct: HTMLImageElement;
	protected titleProduct: HTMLElement;
	protected categoryProduct: HTMLElement;
	protected priceProduct: HTMLElement;
	protected idProduct: string;
	protected events: IEvents;
	protected buttonProduct: HTMLButtonElement;
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.descriptionProduct = container.querySelector('.card__text');
		this.imageProduct = container.querySelector('.card__image');
		this.titleProduct = container.querySelector('.card__title');
		this.categoryProduct = container.querySelector('.card__category');
		this.priceProduct = container.querySelector('.card__price');
		this.buttonProduct = container.querySelector('.card__button');

		this.buttonProduct?.addEventListener('click', () => {
			this.events.emit('product:add', { card: this });
		});
	}

	set prewiew({
		description,
		image,
		title,
		category,
		price,
		id,
	}: {
		description: string;
		image: string;
		title: string;
		category: string;
		price: number;
		id: string;
	}) {
		this.setText(this.descriptionProduct, description);
		this.imageProduct.src = image;
		this.setText(this.titleProduct, title);
		this.setText(this.categoryProduct, category);

		this.idProduct = id;
		if (price === null) {
			this.setText(this.priceProduct, `Бесценно`);
			this.buttonTextAlt();
		} else {
			this.setText(this.priceProduct, `${price} синапсов`);
		}
	}

	get prewiew() {
		return {
			description: this.descriptionProduct.textContent || '',
			image: this.imageProduct.src || '',
			title: this.titleProduct.textContent || '',
			category: this.categoryProduct.textContent || '',
			price: parseFloat(
				this.priceProduct.textContent?.replace(/\D+/g, '') || '0'
			),
			id: this.idProduct || '',
		};
	}

	buttonChange() {
		this.setText(this.buttonProduct, 'Уже в корзине');
		this.setDisabled(this.buttonProduct, true);
	}

	buttonTextAlt() {
		this.setText(this.buttonProduct, 'Купить невозможно');
		this.setDisabled(this.buttonProduct, true);
	}
}
