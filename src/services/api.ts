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
            body: JSON.stringify({isDemo: false})}
        ).then((response) => response.json());
    }

    public registration(data: {email: string, password: string, firstName?: string, lastName?: string, birthDate?: string}): Promise<any> {
        const userUrl = this.middlewareUrl + '/users';
        console.log('data registration', data);
        return fetch(userUrl, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                // firstName: data.firstName,
                // lastName: data.lastName,
                // birthDate: data.birthDate,
            })}
        ).then((response) => response.json());
    }
}