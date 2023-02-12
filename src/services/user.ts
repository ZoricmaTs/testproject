import {api} from '../index';
import UserModel from '../models/user';

export default class User {
    private userModel: UserModel;
    constructor() {

    }

    public getUser(data?: any): any {
        if (this.userModel) {
            return Promise.resolve(this.userModel);
        }

        return api.getUser(data)
            .then((response: any) => {
                if (response.length === 0) {
                    return Promise.reject(new Error('пользователь не найден'));
                }

                this.userModel = new UserModel(response);
                return this.userModel;
            })
            .catch((error: ErrorEvent) => {
                return Promise.reject(error);
            })

    }
}