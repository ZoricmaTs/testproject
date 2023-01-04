import {api} from '../index';
import UserModel from '../models/user';

export default class User {
    private userModel: UserModel;
    constructor() {

    }

    public getUser(): any {
        if (this.userModel) {
            return Promise.resolve(this.userModel);
        }

        return api.getUser().then((response: any) => {
            this.userModel = new UserModel(response);
            return this.userModel;
        })
    }
}