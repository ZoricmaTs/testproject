
export default class Operator {
    public isDemo: boolean;
    private readonly headerItems: any;

    constructor(params: any) {
        this.isDemo = params.isDemo;
        this.headerItems = params.headerItems;
    }

    public getHeaderItems(): any {
        return this.headerItems;
    }
}