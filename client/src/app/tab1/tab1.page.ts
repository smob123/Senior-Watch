import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // the initial room state
  private initialRoomData = [{
    room: "Living Room",
    // Icons made by www.flaticon.com
    image: "assets/living_room.png",
    numberOfActions: 0
  },
  {
    room: "Kitchen",
    // Icons made by www.flaticon.com
    image: "assets/kitchen.png",
    numberOfActions: 0
  },
  {
    room: "Dining Room"
    // Icons made by www.flaticon.com
    , image: "assets/dinner_room.png",
    numberOfActions: 0
  },
  {
    room: "Toilet",
    // Icons made by www.flaticon.com
    image: "assets/toilet.png",
    numberOfActions: 0
  },
  {
    room: "Bedroom",
    // Icons made by www.flaticon.com
    image: "assets/bedroom.png",
    numberOfActions: 0
  }];

  // holds the current state of all the rooms
  private rooms = [];
  // the last senior activity
  private lastActivity: { room: string, time: string }

  constructor(private store: Store<AppState>) {
    // set the initial value of the last activity
    this.lastActivity = {
      room: 'Unknown',
      time: 'Unknown'
    }

    store.select('rooms').subscribe(values => {
      this.getTotalNumberOfActions(values);
      this.getTimeAndLocationOfLastVisitedRoom(values);
    })
  }

  /**
   * calculates the number of actions in each room
   */
  private getTotalNumberOfActions(values: Array<any>) {
    this.rooms = this.initialRoomData;
    for (let i = 0; i < values.length; i++) {
      this.rooms[i].numberOfActions = values[i].numberOfActions;
    }
  }

  /**
   * looks for the last time and place where the senior was active
   */
  private getTimeAndLocationOfLastVisitedRoom(values: Array<any>) {
    let latestRoom = '';
    let latestTime = new Date('01-01-1990');

    // go through all the rooms
    for (const room of values) {
      // get the last motion in the current room
      const lastMotion = room.motion[room.motion.length - 1];
      // check the senior has entered the room
      if (lastMotion.value === 1) {
        // get the time of the motion
        const datetime = new Date(lastMotion.datetime);
        // check if it is more recent than latestTime
        if (datetime.getTime() > latestTime.getTime()) {
          latestTime = datetime;
          latestRoom = room.room;
        }
      }
    }

    // check if latestRoom was assigned a new value
    if (latestRoom !== '') {
      // get the time of the last activity
      const hours = latestTime.getHours() > 12 ? Math.abs(12 - latestTime.getHours()) : latestTime.getHours();
      const minutes = latestTime.getMinutes() < 10 ? `0${latestTime.getMinutes()}` : latestTime.getMinutes();
      const seconds = latestTime.getSeconds() < 10 ? `0${latestTime.getSeconds()}` : latestTime.getSeconds();
      const timeOfDay = latestTime.getHours() > 12 ? 'PM' : 'AM';

      // update the time and place of the last activity
      this.lastActivity.time = `${hours}:${minutes}:${seconds} ${timeOfDay}`;
      this.lastActivity.room = latestRoom;
    }
  }
}
