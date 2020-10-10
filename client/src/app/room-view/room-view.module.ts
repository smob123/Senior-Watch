import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomViewPageRoutingModule } from './room-view-routing.module';

import { RoomViewPage } from './room-view.page';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomViewPageRoutingModule,
    ChartsModule
  ],
  declarations: [RoomViewPage]
})
export class RoomViewPageModule {
  constructor() { }
}
