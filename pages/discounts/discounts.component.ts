import { Component } from "@angular/core";
import { FormService } from "src/app/modules/form/form.service";
import {
	DiscountService,
	Discount,
} from "../../services/discount.service";
import { AlertService, CoreService } from "wacom";
import { TranslateService } from "src/app/modules/translate/translate.service";
import { FormInterface } from "src/app/modules/form/interfaces/form.interface";

@Component({
	templateUrl: "./discounts.component.html",
	styleUrls: ["./discounts.component.scss"],
})
export class DiscountsComponent {
	columns = ["name", "description"];

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
						value: "fill discounts title",
					},
					{
						name: "Label",
						value: "Title",
					},
				],
			},
			{
				name: "Text",
				key: "description",
				fields: [
					{
						name: "Placeholder",
						value: "fill discounts description",
					},
					{
						name: "Label",
						value: "Description",
					},
				],
			},
		],
	});

	config = {
		create: () => {
			this._form.modal<Discount>(this.form, {
				label: "Create",
				click: (created: unknown, close: () => void) => {
					this._sd.create(created as Discount);
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
	};

	get rows(): Discount[] {
		return this._sd.discounts;
	}

	constructor(
		private _sd: DiscountService,
		private _translate: TranslateService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService
	) { }
}
