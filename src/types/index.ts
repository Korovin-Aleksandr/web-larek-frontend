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
  shopingList: IProduct[];
  amountProduct: number;
  total: number;
  address: string;
  email: string;
  telephone: string;
  paymentMethods:  string;
}

export interface IProductsData {
  cards: IProduct[];
  preview: string | null;
  getCard(cardId: string): IProduct;
  addProductToBasket(product: IProduct): void;
}

export interface IOrderData {
  addProductToBasket(product: IProduct): void;
  deleteProduct(product: IProduct): void;
  calculationAmountOrder(shopingList: IProduct[]): number;
  choicePaymentMethod(name: string, label: string): void;
  addUserAdress(adress: string): void;
  addUserEmail(email: string): void;
  addUserTelephone(telephone: string): void;
  checkValidation(data: Record<keyof TUserData, string>): boolean;
  updateOrderInfo(): void;
}

export type TPaymentMethods = Pick<IOrder, 'paymentMethods' | 'address'>;

export type TUserData = Pick<IOrder, 'email' | 'telephone' | 'address'>;

export interface IApi {
  baseUrl: string;
  get(uri: string): Promise<ApiListResponse<IProduct>>;
  post(uri: string, data: object, method?: ApiPostMethods): Promise<ApiListResponse<IProduct>>;
}