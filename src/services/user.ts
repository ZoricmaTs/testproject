import {api} from '../index';
import UserModel from '../models/user';

export type UserInfo = {
	email: string,
	password: string,
	firstName?: string,
	lastName?: string,
	birthDate?: string,
	gender?: string,
}

export default class User {
	private userModel: UserModel;
	private data: UserInfo;
	constructor() {

	}

	public addUser(data: UserInfo): any {
		return api.registration(data)
			.then((response: any) => {
				this.data = response;
			});
	}

	public getUser(data?: UserInfo): any {
		if (this.userModel) {
			return Promise.resolve(this.userModel);
		}

		this.data = data;

		if (!data) {
			this.data = JSON.parse(localStorage.user);
		}

		return api.getUser({email: this.data.email, password: this.data.password})
			.then((response: any) => {
				if (response.length === 0) {
					return Promise.reject(new Error('пользователь не найден'));
				}

				this.userModel = new UserModel(response[0]);

				return this.userModel;
			})
			.catch((error: ErrorEvent) => {
				return Promise.reject(error);
			});
	}
}