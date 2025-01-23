import { IProduct } from './../types/index';
import { ApiListResponse, Api } from './base/api';
import { OrderData } from './orderData';

export interface IAuctionAPI {
	getLotList: () => Promise<IProduct[]>;
	postOrder: (orderData: OrderData) => Promise<OrderData>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLotList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	postOrder(data: OrderData): Promise<OrderData> {
		return this.post('/order', data).then((data: any) => {
			return new OrderData(data.events);
		});
	}
}
