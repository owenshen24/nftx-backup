import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundComponent } from './fund/fund.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'fund/:id',
    component: FundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
