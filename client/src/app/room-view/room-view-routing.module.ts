import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomViewPage } from './room-view.page';

const routes: Routes = [
  {
    path: '',
    component: RoomViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomViewPageRoutingModule {}
