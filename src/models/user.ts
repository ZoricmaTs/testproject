export default class UserModel {
    private readonly id: number;
    private readonly name: string;
    constructor(params: any) {
        this.id = params.id;
        this.name = params.name;
    }

    public getName(): string {
        return this.name;
    }

    public getId(): number {
        return this.id;
    }
}