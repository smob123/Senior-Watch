import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { RadialChartOptions } from 'chart.js';
import { AppState } from '../app.state';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // the chart's options
  chartOptions: RadialChartOptions = {
    responsive: true,
  };

  // the labels of the different vlaues in the chart
  chartLabels: Array<any>

  // the chart's data
  chartData: Array<any>

  // most visited rooms
  mostVisitedLocations: Array<any>

  constructor(store: Store<AppState>) {
    store.select('rooms').subscribe(vals => {
      // initialize the chart's data
      this.chartLabels = [];
      this.chartData = [{ data: [], label: ['Visits'] }];
      this.mostVisitedLocations = [];

      // go through each room and update the chart's data
      for (const room of vals) {
        this.chartData[0].data.push(this.getTotalRoomMotion(room.motion));
        this.chartLabels.push(room.room);

        this.mostVisitedLocations.push({ room: room.room, numberOfActions: this.getTotalRoomMotion(room.motion) });
      }

      this.calculateMostActoveLocations();
    })
  }

  /**
   * calculates the total number of motions in a room
   */
  private getTotalRoomMotion(motion: Array<any>) {
    let totalMotion = 0;
    for (const m of motion) {
      totalMotion += m.value;
    }

    return totalMotion;
  }

  /**
   * finds the most visited rooms, and orders them in a descending order.
   */
  private calculateMostActoveLocations() {
    for (let i = 0; i < this.mostVisitedLocations.length; i++) {
      for (let j = i + 1; j < this.mostVisitedLocations.length; j++) {
        if (this.mostVisitedLocations[i].numberOfActions < this.mostVisitedLocations[j].numberOfActions) {
          const temp = this.mostVisitedLocations[i];
          this.mostVisitedLocations[i] = this.mostVisitedLocations[j];
          this.mostVisitedLocations[j] = temp;
        }
      }
    }
  }
}
