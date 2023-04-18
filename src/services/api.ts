import {UserInfo} from './user';

export default class Api {
    private readonly middlewareUrl: string;

    constructor() {
        this.middlewareUrl = 'http://localhost:3000';
    }

    public getUser(data?: any): Promise<any> {
        const userUrl = this.middlewareUrl + `/users?email=${data.email}&password=${data.password}`;

        return fetch(userUrl).then((response) => response.json());
    }

    public getOperator(): Promise<any> {
        const userUrl = this.middlewareUrl + '/operator';

        return fetch(userUrl).then((response) => response.json());
    }

    public isAuthorization(): Promise<any> {
        const userUrl = this.middlewareUrl + '/operator';

        return fetch(userUrl, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                isDemo: false
            })
        })
          .then((response) => response.json());
    }

    public registration(data: UserInfo): Promise<any> {
        const userUrl = this.middlewareUrl + '/users';

        return fetch(userUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(data)}
        ).then((response) => response.json());
    }

    public getRooms(page: number, pageSize: number): Promise<any> {
        const roomsUrl = this.middlewareUrl + `/rooms?_page=${page}&_limit=${pageSize}`;

        return fetch(roomsUrl).then((response) => response.json());
    }
}