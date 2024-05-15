import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { DiscountsComponent } from './discounts.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: DiscountsComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		DiscountsComponent
	],
	providers: []

})

export class DiscountsModule { }
