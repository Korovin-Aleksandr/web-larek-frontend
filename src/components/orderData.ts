import validate from 'validate.js';
import { constraintsUser } from "../utils/constants";
import { IEvents } from "./base/events";
import { IProduct, IOrder, IOrderData, TUserData } from "../types/index";

export class OrderData implements IOrderData {
  protected _id: string;
  protected shopingList: any[];
  protected amountProduct: number;
  protected total: number;
  protected address: string;
  protected email: string;
  protected telephone: string;
  protected paymentMethods:  string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setOrderInfo(orderData: IOrder) {
    this._id = orderData.id;
    this.shopingList = orderData.shopingList;
    this.amountProduct = orderData.amountProduct;
    this.total = orderData.total;
    this.address = orderData.address;
    this.email = orderData.email;
    this.telephone = orderData.telephone;
    this.paymentMethods = orderData.paymentMethods;
  }  
  deleteProduct(product: IProduct): void {
    this.events.emit("basket-item:delete", product);
  };
  
  calculationAmountOrder(shopingList: IProduct[]): number {
    return shopingList.reduce((acc, item) => acc + item.price, 0)
  };

  choicePaymentMethod(name: string, label: string): void {
    this.events.emit("paymentMethod:choice", {name, label})
  };

  addUserAdress(adress: string): void {
    this.events.emit("address:input", {adress})
  };

  addUserEmail(email: string): void {
    this.events.emit("email:input", {email})
  };

  addUserTelephone(telephone: string): void {
    this.events.emit("telephone:input", {telephone})
  };

  checkValidation(data: Record<keyof TUserData, string>): boolean {
    const isValid = !Boolean(validate(data, constraintsUser));
    return isValid;
  };
}