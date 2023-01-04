
export default class Operator {
    private isAuthorization: boolean;
    private readonly headerItems: any;

    constructor(params: any) {
        this.isAuthorization = params.isAuthorization;
        this.headerItems = params.headerItems;
    }

    public getHeaderItems(): any {
        return this.headerItems;
    }
}