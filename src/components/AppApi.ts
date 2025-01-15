import { IApi, IProduct, IOrder, TPaymentMethods, TUserData } from './../types/index';
import { ApiListResponse, Api } from './base/api';

export interface IAuctionAPI {
  getLotList: () => Promise<IProduct[]>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }


  // getLotList(): Promise<IProduct[]> {
  //   return this.get('/product').then((data: ApiListResponse<IProduct>) => data.items);
  // }
  getLotList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
}
  
}
