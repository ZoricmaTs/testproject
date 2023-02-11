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
}