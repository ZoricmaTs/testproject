import DateAbstract from './index';

export default class SimpleDate extends DateAbstract {
    protected rootElement: HTMLDivElement;
    constructor(params: any) {
        super(params);
    }

    public init(): any {
        this.rootElement = document.createElement('div');
    }
}