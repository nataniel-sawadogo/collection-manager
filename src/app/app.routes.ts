import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'items', component: ItemListComponent },
  { path: 'item/new', component: ItemDetailComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: '**', redirectTo: '/items' }
];
