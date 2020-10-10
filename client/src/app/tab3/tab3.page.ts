import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  // stores the charge levels of all the batteries
  batteryLevels = [{
    room: "Living Room",
    image: "assets/battery_0.png",
    batteryLevel: -1
  },
  {
    room: "Kitchen",
    image: "assets/battery_0.png",
    batteryLevel: -1
  },
  {
    room: "Dining Room"
    , image: "assets/battery_0.png",
    batteryLevel: -1
  },
  {
    room: "Toilet",
    image: "assets/battery_0.png",
    batteryLevel: -1
  },
  {
    room: "Bedroom",
    image: "assets/battery_0.png",
    batteryLevel: -1
  }]

  constructor(store: Store<AppState>) {
    store.select('rooms').subscribe(vals => {
      // check if there are any values in the global state
      if (vals.length === 0) {
        return;
      }

      // reset the battery levels array
      this.batteryLevels = [];
      for (const room of vals) {
        const batteryLevel = room.batteryLevel;
        let image;

        // select an image based on the battery's charge level
        if (batteryLevel >= 81) {
          image = 'assets/battery_100.png';
        } else if (batteryLevel >= 51 && batteryLevel <= 80) {
          image = 'assets/battery_51-80.png';
        } else if (batteryLevel >= 21 && batteryLevel <= 50) {
          image = 'assets/battery_21-50.png';
        } else if (batteryLevel >= 1 && batteryLevel <= 20) {
          image = 'assets/battery_1-20.png';
        } else {
          image = 'assets/battery_0.png';
        }

        this.batteryLevels.push({
          room: room.room,
          batteryLevel,
          image
        })
      }
    });
  }
}
