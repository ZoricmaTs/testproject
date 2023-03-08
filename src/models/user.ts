export default class UserModel {
    private readonly id: number;
    private readonly firstName: string;
    private readonly lastName: string;
    constructor(params: any) {
        this.id = params.id;
        this.firstName = params.firstName;
        this.lastName = params.lastName;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getId(): number {
        return this.id;
    }
}