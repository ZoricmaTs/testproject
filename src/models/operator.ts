
export default class Operator {
    private readonly isAuthorization: boolean;
    private readonly headerItems: any;

    constructor(params: any) {
        this.isAuthorization = params.isAuthorization;
        this.headerItems = params.headerItems;
    }

    public getHeaderItems(): any {
        return this.headerItems;
    }

    public isDemo(): boolean {
        return !this.isAuthorization;
    }
}