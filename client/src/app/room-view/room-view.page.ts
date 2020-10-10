import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RadialChartOptions } from 'chart.js';
import { AppState } from '../app.state';

@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.page.html',
  styleUrls: ['./room-view.page.scss'],
})
export class RoomViewPage implements OnInit {

  // the name of the room that the user is viewing
  private roomName = ''

  // the chart's data
  private chartData: Array<any>;
  private chartLabels = [];
  private chartOptions: RadialChartOptions = {
    responsive: true,
  };

  constructor(store: Store<AppState>, activedRoute: ActivatedRoute) {
    // get the name of the room from the current route
    this.roomName = activedRoute.snapshot.paramMap.get('name');
    store.select('rooms').subscribe(values => {
      // look for the current room's data in the global state
      for (const room of values) {
        if (room.room.toUpperCase() === this.roomName.toUpperCase()) {
          this.getMovementData(room.motion);
          return;
        }
      }
    })
  }

  /**
   * gets the senior's movement data in the room.
   */
  private getMovementData(motion: Array<any>) {
    // reset the chart's data
    this.chartData = [{ data: [], label: ['Movements'] }];
    this.chartLabels = [];

    for (const m of motion) {
      // get the number of motions by datetime, and add them to the chart's data and labels
      this.chartData[0].data.push(m.value);
      const motionDate = new Date(m.datetime);
      this.chartLabels.push(`${motionDate.getHours()}:${motionDate.getMinutes()}:${motionDate.getSeconds()}`);
    }
  }

  ngOnInit() {
  }

}
