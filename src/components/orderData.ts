import validate from 'validate.js';
import { constraintsUser } from "../utils/constants";
import { IEvents } from "./base/events";
import { IProduct, IOrder, IOrderData, TUserData } from "../types/index";

export class OrderData implements IOrderData {
  protected _id: string;
  shopingList: any[];
  amountProduct: number;
  intex: number;
  protected total: number;
  protected address: string;
  protected email: string;
  protected telephone: string;
  protected paymentMethods:  string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.shopingList = [];  // Инициализируем пустой список товаров
    this.amountProduct = 0; // Изначально товаров нет
    this.intex = 0;
    this.total = 0;         // Изначальная стоимость = 0
    this.address = '';
    this.email = '';
    this.telephone = '';
    this.paymentMethods = '';
  }

  setOrderInfo(orderData: IOrder) {
    this._id = orderData.id;
    this.shopingList = orderData.shopingList || [];
    this.amountProduct = orderData.amountProduct || 0;
    this.intex = orderData.index || 0;
    this.total = orderData.total || 0;
    this.address = orderData.address || '';
    this.email = orderData.email || '';
    this.telephone = orderData.telephone || '';
    this.paymentMethods = orderData.paymentMethods || '';
  }

  addProductToBasket(product: IProduct): void {
    this.shopingList.push(product);
    this.calculationAmountOrder();
    this.indexCounter()
    this.total += product.price;
    this.events.emit('basket-item:add', product);
    this.updateOrderInfo();

    this.events.emit('basket:update', { amount: this.amountProduct, total: this.total });
    this.updateOrderInfo();
  }

  deleteProduct(product: IProduct): void {
    this.shopingList = this.shopingList.filter((item) => item.id !== product.id);
    this.calculationAmountOrder();
    this.total = this.calculateTotal();
    this.events.emit('basket:update', { amount: this.amountProduct, total: this.total });;
  };
  
  calculationAmountOrder(): number {
    this.amountProduct = this.shopingList.length; // Обновляем свойство объекта
    return this.amountProduct;
  };

  calculateTotal(): number {
    return this.shopingList.reduce((total, item) => total + item.price, 0);
  }

  indexCounter(): void {
    this.shopingList.forEach((item, index) => {
    item.index = index + 1;
    });
  }

  choicePaymentMethod(name: string, label: string): void {
    this.paymentMethods = name;
  };

  addUserAdress(address: string): void {
    this.address = address;
  };

  addUserEmail(email: string): void {
    this.email = email;
  };

  addUserTelephone(telephone: string): void {
    this.telephone = telephone;
  };

  checkValidation(data: Record<keyof TUserData, string>): boolean {
    const isValid = !Boolean(validate(data, constraintsUser));
    return isValid;
  };
  updateOrderInfo() {
    const updatedOrderData: IOrder = {
      id: this._id,
      shopingList: this.shopingList,
      amountProduct: this.amountProduct,
      index: this.intex,
      total: this.total,
      address: this.address,
      email: this.email,
      telephone: this.telephone,
      paymentMethods: this.paymentMethods,
    };
    this.setOrderInfo(updatedOrderData);
  }

 
}