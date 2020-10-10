import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import * as RoomActions from '../actions/room.actions';
import { RoomModel } from '../models/room.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  private mqttClient: any = null;
  private topic: string = 'swen325/a3';
  private clientId: string = `${Date.now()}MFKSM8748237Ynjdnjsdbhdb` // this string must be unique to every client
  // the current senior status
  private currentState = [];
  // handles controlling notifications
  private notification: Notification;
  // check if a received message is the first one in the feed
  private firstFeed = true;

  constructor(private store: Store<AppState>, private navCtrl: NavController) {
    this.connect();
  }

  /**
   * connects to the MQTT broker
   */
  public connect() {
    /**
     * This will generate an error because we have not imported Paho as name
     * using import but this is okay since we have included paho-mqtt.js
     * in the index.html. 
     * The solution to this issue to write an Ionic/angular wrapper to Paho MQTT.
     * Note that current available wrappers have issues with Ionic.
     */
    this.mqttClient = new Paho.MQTT.Client('broker.emqx.io', 8083, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({ timeout: 10, useSSL: false, onSuccess: this.onConnect, onFailure: this.onFailure });
  }

  /**
   * executes when a connection is established to the MQTT broker
   */
  public onConnect = () => {
    console.log('Connected');
    // subscribe
    this.mqttClient.subscribe(this.topic);
  }

  /**
   * handles failing to connect to the MQTT broker
   */
  public onFailure = (responseObject) => {
    console.log('Failed to connect');
  }

  /**
   * handles losing connection to the MQTT broker
   */
  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('Connection lost');
      // attempt to reconnect
      console.log('Reconnecting...')
      this.connect();
    }
  }

  /**
   * handles receiving messages from the broker
   */
  public onMessageArrived = (message) => {
    // parse the message into JSON
    const payload = JSON.parse(message.payloadString);
    // stores the new state
    const newState = [];

    // check if the current state is not empty
    if (this.currentState.length > 0) {
      // loop through all the rooms in the current state
      for (let i = 0; i < this.currentState.length; i++) {
        // get the current room's details from the received message
        const room = payload[i];
        // store them, and update the number of actions in the room
        const details = {
          ...room,
          motion: [...this.currentState[i].motion, { datetime: room.datetime, value: room.motion }],
          numberOfActions: this.currentState[i].numberOfActions + room.motion
        }

        newState.push(details)
      }
    } else {
      // otherwise go through each room in the payload and add a RoomModel object to the new state
      for (const room of payload) {
        newState.push({
          ...room,
          motion: [{
            datetime: room.datetime,
            value: room.motion
          }],
          numberOfActions: room.motion
        })
      }
    }

    // update the current state, and the global state
    this.currentState = newState;
    this.store.dispatch(new RoomActions.SetRooms(newState));
    // check how long it has been since the last activity
    this.checkLastActiveTime(newState);
  }

  /**
   * checks the amount of time that has passed since the last activity of the senior.
   */
  private checkLastActiveTime(state: Array<RoomModel>) {
    // stores the last active time
    let latestActiveTime = new Date('1-1-1990');

    // go through each room
    for (const room of state) {
      const lastMotion = room.motion[room.motion.length - 1];
      const lastMotionDate = new Date(lastMotion.datetime);
      const lastMotionValue = lastMotion.value;

      // check if the last activity in the room is more recent than the lastActiveTime
      if (lastMotionValue === 1 && lastMotionDate.getTime() > latestActiveTime.getTime()) {
        // update the lastActiveTime
        latestActiveTime = lastMotionDate;
      }
    }

    // check how many seconds it has been since the last activity
    const now = new Date(Date.now());
    const diffInSeconds = (now.getTime() - latestActiveTime.getTime()) / 1000;

    // push a notification if it has been more than 5 minutes, and if the received message is not the first one in the feed
    if (diffInSeconds >= 300 && !this.firstFeed) {
      this.showNotification();
    } else {
      this.firstFeed = false;
    }
  }

  /**
   * displays a notification once if the senior is not active for a given period of time.
   */
  private async showNotification() {
    // check if a notification was sent earlier
    if (this.notification) {
      return;
    }

    // check if notification permission was granted
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    // initialize the notification object
    this.notification = new Notification('Senior Inactive', {
      body: 'Senior has not been active for sometime'
    });

    // close the notification, and go to the senior status screen when the notification is clicked.
    this.notification.addEventListener('click', () => {
      this.notification.close();
      this.navCtrl.navigateForward('/tabs/tab1');
    })
  }
}
