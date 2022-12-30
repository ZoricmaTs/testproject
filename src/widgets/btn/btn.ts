import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';

export type ButtonParams = {
    title: string,
    classes: string[],
    onClick: () => void,
}

export default class Btn extends AbstractWidget {
    private classes: string[];
    private readonly title: string;
    private rootElement: Element;
    private readonly action: () => void;

    constructor(params: any) {
        super(params);
        
        this.title = params.title;
        this.classes = ['button'].concat(params.classes);
        this.action = params.onClick;

        this.onClick = this.onClick.bind(this);
    }

    public getTitle(): string {
        return this.title;
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public onClick(): void {

        if (this.action) {
            this.action();
        }
    }

    public init(): void {
        const button = Helper.DOM(`<button style="${this.classes.join(', ')}">${this.getTitle()}</button>`);
        button.addEventListener('click', this.onClick);
        this.rootElement = button;
    }
}