import { ApiPostMethods } from "../components/base/api";
import { ApiListResponse } from "../components/base/api";

export interface IProduct {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number;
}

export interface IOrder {
  id: string;
  items: IProduct[];
  amountProduct: number;
  index: number;
  total: number;
  address: string;
  email: string;
  phone: string;
  payment:  string;
}

export interface IProductsData {
  cards: IProduct[];
  preview: string | null;
  getCard(cardId: string): IProduct;
}

export interface IOrderData {
  setOrderInfo(orderData: IOrder): void;
  getOrderInfo(): IOrder;
  addProductToBasket(product: IProduct): void;
  deleteProduct(product: IProduct): void;
  calculationAmountOrder(shopingList: IProduct[]): number;
  calculateTotal(): number;
  indexCounter(): void;
  choicePaymentMethod(name: string, label: string): void;
  addUserAdress(adress: string): void;
  addUserEmail(email: string): void;
  addUserTelephone(telephone: string): void;
  updateOrderInfo(): void;
  resetOrderData(): void;
  convertingObject(items: IProduct[]): string[]
}

export type TPaymentMethods = Pick<IOrder, 'payment' | 'address'>;

export type TUserData = Pick<IOrder, 'email' | 'phone' | 'address'>;

export interface IApi {
  baseUrl: string;
  get(uri: string): Promise<ApiListResponse<IProduct>>;
  post(uri: string, data: object, method?: ApiPostMethods): Promise<ApiListResponse<IProduct>>;
}