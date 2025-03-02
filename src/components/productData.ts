import { IEvents } from './base/events';
import { IProduct, IProductsData } from '../types/index';

export class ProductData implements IProductsData {
	protected _cards: IProduct[];
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: IProduct[]) {
		this._cards = cards;
	}

	get cards() {
		return this._cards;
	}

	getCard(productId: string) {
		return this._cards.find((item) => item.id === productId);
	}

	set preview(cardId: string | null) {
		if (!cardId) {
			this._preview = null;
			return;
		}
		const selectedCard = this.getCard(cardId);
		if (selectedCard) {
			this._preview = cardId;
			this.events.emit('product:open');
		}
	}
	get preview() {
		return this._preview;
	}
}
