import { IEvents } from "./base/events";
import { IProduct, IOrder, IOrderData} from "../types/index";

export class OrderData implements IOrderData {
  protected _id: string;
  items: any[];
  amountProduct: number;
  intex: number;
  total: number;
  protected address: string;
  protected email: string;
  protected phone: string;
  protected payment:  string;
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.items = [];
    this.amountProduct = 0;
    this.intex = 0;
    this.total = 0;         
    this.address = '';
    this.email = '';
    this.phone = '';
    this.payment = '';
  }

  setOrderInfo(orderData: IOrder) {
    this._id = orderData.id;
    this.items = orderData.items || [];
    this.amountProduct = orderData.amountProduct || 0;
    this.intex = orderData.index || 0;
    this.total = orderData.total || 0;
    this.address = orderData.address || '';
    this.email = orderData.email || '';
    this.phone = orderData.phone || '';
    this.payment = orderData.payment || '';
  }

  getOrderInfo(): IOrder {  
    return {
      id: this._id,
      items: this.items,
      amountProduct: this.amountProduct,
      index: this.intex,
      total: this.total,
      address: this.address,
      email: this.email,
      phone: this.phone,
      payment: this.payment,
    };
  }

  addProductToBasket(product: IProduct): void {
    this.items.push(product);
    this.calculationAmountOrder();
    this.indexCounter()
    this.total += product.price;
    this.events.emit('basket-item:add', product);
    this.updateOrderInfo();

    this.events.emit('basket:update', { amount: this.amountProduct, total: this.total });
    this.updateOrderInfo();
  }

  deleteProduct(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);
    this.calculationAmountOrder();
    this.total = this.calculateTotal();
    this.events.emit('basket:update', { amount: this.amountProduct, total: this.total });;
  };
  
  calculationAmountOrder(): number {
    this.amountProduct = this.items.length;
    return this.amountProduct;
  };

  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  indexCounter(): void {
    this.items.forEach((item, index) => {
    item.index = index + 1;
    });
  }

  choicePaymentMethod(name: string, label: string): void {
    this.payment = name;
  };

  addUserAdress(address: string): void {
    this.address = address;
  };

  addUserEmail(email: string): void {
    this.email = email;
  };

  addUserTelephone(telephone: string): void {
    this.phone = telephone;
  };

  updateOrderInfo() {
    const updatedOrderData: IOrder = {
      id: this._id,
      items: this.items,
      amountProduct: this.amountProduct,
      index: this.intex,
      total: this.total,
      address: this.address,
      email: this.email,
      phone: this.phone,
      payment: this.payment,
    };
    this.setOrderInfo(updatedOrderData);
  }

  resetOrderData(): void {
    this._id = '';
    this.items = [];
    this.amountProduct = 0;
    this.intex = 0;
    this.total = 0;
    this.address = '';
    this.email = '';
    this.phone = '';
    this.payment = '';
  }
 
  convertingObject(items: IProduct[]): string[] {
    return items
    .filter(item => item.id !== "b06cde61-912f-4663-9751-09956c0eed67") 
    .map(item => item.id); 
  }
}