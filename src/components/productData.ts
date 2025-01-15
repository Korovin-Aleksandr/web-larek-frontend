import { IEvents } from "./base/events";
import { IProduct, IProductsData} from "../types/index";
import { basketItem } from "./common/basketModal";
import { cloneTemplate } from "../utils/utils";

export class ProductData implements IProductsData {
  protected _cards: IProduct[];
  protected _preview: string | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  set cards(cards: IProduct[]) {
    this._cards = cards;
    this.events.emit("productList:changed", cards);
  }

  get cards() {
    return this._cards;
  }

  addProductToBasket(product: IProduct): void {
    this.events.emit("product:add", product);
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
      this.events.emit("product:open");
    }
  }
  get preview() {
    return this._preview;
  }
}