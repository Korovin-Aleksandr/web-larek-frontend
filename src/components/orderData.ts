import validate from 'validate.js';
import { constraintsUser } from "../utils/constants";
import { IEvents } from "./base/events";
import { IProduct, IOrder, IOrderData, TUserData } from "../types/index";

export class OrderData implements IOrderData {
  protected _id: string;
  shopingList: any[];
  amountProduct: number;
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
    this.total = orderData.total || 0;
    this.address = orderData.address || '';
    this.email = orderData.email || '';
    this.telephone = orderData.telephone || '';
    this.paymentMethods = orderData.paymentMethods || '';
  }

  addProductToBasket(product: IProduct): void {
    this.shopingList.push(product);
    this.calculationAmountOrder();
    this.total += product.price;
    this.events.emit('basket-item:add', product);
    this.updateOrderInfo();

    this.events.emit('basket:update', { amount: this.amountProduct });
    this.updateOrderInfo();
  }

  deleteProduct(product: IProduct): void {
    this.shopingList = this.shopingList.filter(item => item.id !== product.id)
    this.events.emit('basket:update', { amount: this.amountProduct });
  };
  
  calculationAmountOrder(): number {
    this.amountProduct = this.shopingList.length; // Обновляем свойство объекта
    return this.amountProduct;
  };

  choicePaymentMethod(name: string, label: string): void {
    this.paymentMethods = name; // Сохраняем выбранный метод
    this.events.emit("paymentMethod:choice", { name, label });
  };

  addUserAdress(address: string): void {
    this.address = address;
    this.events.emit("address:input", { address });
  };

  addUserEmail(email: string): void {
    this.email = email;
    this.events.emit("email:input", { email });
  };

  addUserTelephone(telephone: string): void {
    this.telephone = telephone;
    this.events.emit("telephone:input", {telephone})
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
      total: this.total,
      address: this.address,
      email: this.email,
      telephone: this.telephone,
      paymentMethods: this.paymentMethods,
    };
    this.setOrderInfo(updatedOrderData);
  }

 
}