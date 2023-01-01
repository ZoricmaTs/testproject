import AbstractWidget from '../abstractWidget';
import './style.styl';
import * as Helper from '../../helper';

export default class Logo extends AbstractWidget {
    private src: string = require('./logo.svg');
    private rootElement: Element;
    constructor(params: any) {
        super(params);
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public init(): void {
        const markup: string = `<img src="${this.src}" width="106" height="40" alt="logo"/>`;
        this.rootElement = Helper.DOM(markup);
    }
}