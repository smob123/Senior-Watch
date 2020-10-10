/**
 * the app's global state.
 */

import { RoomModel } from './models/room.model';

export interface AppState {
    readonly rooms: RoomModel[];
}