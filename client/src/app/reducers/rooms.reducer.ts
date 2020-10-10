/**
 * handles executing actions to the global state.
 */

import { RoomModel } from '../models/room.model';
import * as RoomActions from '../actions/room.actions';

const initialState = [];

export function roomsReducer(state: RoomModel[] = initialState, action: RoomActions.Actions) {
    switch (action.type) {
        case RoomActions.SET_ROOMS:
            return action.payload;
        default:
            return state;
    }
}