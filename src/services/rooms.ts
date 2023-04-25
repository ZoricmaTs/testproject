import {api} from '../index';
import RoomModel from '../models/room';

export default class Rooms {
  private roomModels: RoomModel[];
    constructor() {

    }

    public getRooms(page: number, pageSize: number): any {
        // if (this.roomModels && this.roomModels.length > 0) {
        //     return Promise.resolve(this.roomModels);
        // }

        return api.getRooms(page, pageSize)
            .then((response: any) => {
                if (response.length === 0) {
                    return Promise.reject(new Error('комнаты не найдены'));
                }

                this.roomModels = response.map((room: any) => new RoomModel(room));

                return this.roomModels;
            })
            .catch((error: ErrorEvent) => {
                return Promise.reject(error);
            })
    }

  public getSearchRooms(page: number, pageSize: number, dates?: any): any {
    return api.getSearchRooms(page, pageSize, dates)
      .then((response: any) => {
        if (response.length === 0) {
          return Promise.reject(new Error('комнаты не найдены'));
        }

        this.roomModels = response.map((room: any) => new RoomModel(room));

        return this.roomModels;
      })
      .catch((error: ErrorEvent) => {
        return Promise.reject(error);
      })
  }
}