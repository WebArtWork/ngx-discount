import { Component } from "@angular/core";
import { FormService } from "src/app/modules/form/form.service";
import {
	DiscountService,
	Discount,
} from "../../services/discount.service";
import { AlertService, CoreService, StoreService as _StoreService } from "wacom";
import { TranslateService } from "src/app/modules/translate/translate.service";
import { FormInterface } from "src/app/modules/form/interfaces/form.interface";
import { StoreService, Store } from "src/app/modules/store/services/store.service";
import { Router } from "@angular/router";

@Component({
	templateUrl: "./discounts.component.html",
	styleUrls: ["./discounts.component.scss"],
})
export class DiscountsComponent {
	columns = ["name", "code", "amount"];

	form: FormInterface = this._form.getForm("discounts", {
		formId: "discounts",
		title: "Discounts",
		components: [
			{
				name: "Text",
				key: "name",
				focused: true,
				fields: [
					{
						name: "Placeholder",
						value: "fill discounts title"
					},
					{
						name: "Label",
						value: "Title"
					},
				],
			},
			{
				name: "Number",
				key: "amount",
				fields: [
					{
						name: "Placeholder",
						value: "fill discounts amount"
					},
					{
						name: "Label",
						value: "amount"
					},
				],
			},
			{
				name: 'Select',
				key: 'stores',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill your stores'
					},
					{
						name: 'Label',
						value: 'Stores'
					},
					{
						name: 'Multiple',
						value: true
					},
					{
						name: 'Items',
						value: this.stores
					}
				]
			}
		],
	});

	config = {
		create: () => {
			this._form.modal<Discount>(this.form, {
				label: "Create",
				click: (created: unknown, close: () => void) => {
					this._sd.create(created as Discount,
						this.setDiscounts.bind(this)
					);
					close();
				},
			});
		},
		update: (doc: Discount) => {
			this._form
				.modal<Discount>(this.form, [], doc)
				.then((updated: Discount) => {
					this._core.copy(updated, doc);
					this._sd.save(doc);
				});
		},
		delete: (doc: Discount) => {
			this._alert.question({
				text: this._translate.translate(
					"Common.Are you sure you want to delete this cservice?"
				),
				buttons: [
					{
						text: this._translate.translate("Common.No"),
					},
					{
						text: this._translate.translate("Common.Yes"),
						callback: () => {
							this._sd.delete(doc);
						},
					},
				],
			});
		},
		buttons:
			[
				{
					icon: 'cloud_download',
					click: (doc: Discount) => {
						this._form.modalUnique<Discount>(
							'discount',
							'code',
							doc
						);
					}
				}
			],
	};

	get stores(): Store[] {
		return this._ss.stores;
	}
	
	store: string;
	setStore(store: string) {
		this.store = store;
		this._store.set('store', store);
		this.setDiscounts();
	}

	discounts: Discount[] = [];
	setDiscounts() {
		this.discounts.splice(0, this.discounts.length);
		for (const discount of this._sd.discounts) {
			discount.stores = discount.stores || [];
			if (this.store) {
				if (discount.stores.includes(this.store)) {
					this.discounts.push(discount);
				}
			} else {
				this.discounts.push(discount);
			}
		}
	}

	constructor(
		public _sd: DiscountService,
		private _translate: TranslateService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService,
		private _ss: StoreService,
		private _store: _StoreService,
		private _router: Router
	) { }
}
