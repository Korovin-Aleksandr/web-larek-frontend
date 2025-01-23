import { IOrder } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { CardPreviewModal } from './cardPreviewModal';

export class BasketModal extends Component<IOrder> {
	protected basket: HTMLElement;
	shopingList: HTMLElement;
	protected buttonModal: HTMLButtonElement;
	protected basketPrice: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.basket = container.querySelector('.basket');
		this.shopingList = container.querySelector('.basket__list');
		this.buttonModal = container.querySelector('.button');
		this.basketPrice = container.querySelector('.basket__price');

		this.buttonModal.addEventListener('click', () => {
			this.events.emit('paymant:open');
		});
		this.toggleOrderButton(0);
	}

	set order(total: number) {
		this.setText(this.basketPrice, `${total} синапсов`);
	}

	get order() {
		return parseFloat(this.basketPrice.textContent || '0');
	}

	renderBasketItems(
		items: any[],
		itemTemplate: HTMLTemplateElement,
		componentClass: typeof BasketItem
	) {
		this.shopingList.innerHTML = '';
		items.forEach((itemData, index) => {
			const itemComponent = new componentClass(
				cloneTemplate(itemTemplate),
				this.events
			);
			if (itemComponent instanceof BasketItem) {
				itemComponent.prewiew = {
					title: itemData.title,
					price: itemData.price,
					id: itemData.id,
					index: (index + 1).toString(),
				};
			}
			this.shopingList.append(itemComponent.render());
		});
		this.toggleOrderButton(items.length);
	}

	toggleOrderButton(itemCount: number): void {
		this.setDisabled(this.buttonModal, itemCount === 0);
	}
}

export class BasketItem extends Component<CardPreviewModal> {
	basketItem: HTMLElement;
	protected basketDeleteItem: HTMLButtonElement;
	protected itemTitle: HTMLElement;
	protected itemPrice: HTMLElement;
	protected itemId: string;
	protected itemIndex: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.basketItem = container.querySelector('.basket__item');
		this.itemTitle = container.querySelector('.card__title');
		this.itemPrice = container.querySelector('.card__price');
		this.basketDeleteItem = container.querySelector('.basket__item-delete');
		this.itemIndex = container.querySelector('.basket__item-index');

		this.basketDeleteItem.addEventListener('click', () => {
			this.events.emit('basket-item:delete', { id: this.itemId });
		});
	}

	set prewiew({
		title,
		price,
		id,
		index,
	}: {
		title: string;
		price: number;
		id: string;
		index: string;
	}) {
		this.setText(this.itemTitle, title);
		if (price === 0) {
			this.setText(this.itemPrice, `Бесценно`);
		} else {
			this.setText(this.itemPrice, `${price} синапсов`);
		}
		this.itemId = id;
		this.setText(this.itemIndex, index);
	}

	get prewiew() {
		return {
			title: this.itemTitle.textContent || '',
			price: parseFloat(this.itemPrice.textContent?.replace(/\D+/g, '') || '0'),
			id: this.itemId || '',
			index: this.itemIndex.textContent || '',
		};
	}
}
