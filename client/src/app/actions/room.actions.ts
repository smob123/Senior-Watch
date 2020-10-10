/**
 * defines actions that can be applied to the global state.
 */

import { Action } from '@ngrx/store';
import { RoomModel } from '../models/room.model';

export const SET_ROOMS = 'SET_ROOMS';

export class SetRooms implements Action {
    readonly type = SET_ROOMS;

    constructor(public payload: RoomModel[]) { }
}

export type Actions = SetRooms;