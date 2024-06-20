import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Discount {
	_id: string;
	name: string;
	stores: string[];
	code: string;
	amount: number;
}

@Injectable({
	providedIn: 'root'
})
export class DiscountService {
	discounts: Discount[] = [];

	_discounts: any = {};

	new(): Discount {
		return {
			_id: '',
			name: '',
			stores: [],
			code: '',
			amount: 0
		}
	}

	constructor(
		private mongo: MongoService,
		private alert: AlertService
	) {
		this.discounts = mongo.get('discount', {}, (arr: any, obj: any) => {
			this._discounts = obj;
		});
	}

	create(
		discount: Discount = this.new(),
		callback = (created: Discount) => {},
		text = 'discount has been created.'
	) {
		if (discount._id) {
			this.save(discount);
		} else {
			this.mongo.create('discount', discount, (created: Discount) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(discountId: string): Discount {
		if(!this._discounts[discountId]){
			this._discounts[discountId] = this.mongo.fetch('discount', {
				query: {
					_id: discountId
				}
			});
		}
		return this._discounts[discountId];
	}

	update(
		discount: Discount,
		callback = (created: Discount) => {},
		text = 'discount has been updated.'
	): void {
		this.mongo.afterWhile(discount, ()=> {
			this.save(discount, callback, text);
		});
	}

	save(
		discount: Discount,
		callback = (created: Discount) => {},
		text = 'discount has been updated.'
	): void {
		this.mongo.update('discount', discount, () => {
			if(text) this.alert.show({ text, unique: discount });
		});
	}

	delete(
		discount: Discount,
		callback = (created: Discount) => {},
		text = 'discount has been deleted.'
	): void {
		this.mongo.delete('discount', discount, () => {
			if(text) this.alert.show({ text });
		});
	}
}
