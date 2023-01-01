import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';

export type ButtonParams = {
    title?: string,
    classes: string[],
    action: (params?: any) => void,
    type: ButtonType,
    icon?: string,
    iconClasses?: string[]
}

export enum ButtonType {
    TEXT = 1,
    TEXT_WITH_ICON = 2,
}

export default class Btn extends AbstractWidget {
    private classes: string[];
    private readonly title: string;
    private rootElement: Element;
    private readonly action: () => void;
    private readonly type: ButtonType;
    private readonly icon: string;
    private iconClasses: string[];

    constructor(params: ButtonParams) {
        super(params);

        this.title = params.title;
        this.icon = params.icon;
        this.classes = ['button'].concat(params.classes);

        this.iconClasses = params.iconClasses ? ['material-icons'].concat(params.iconClasses) : ['material-icons'];
        this.action = params.action;
        this.type = params.type;

        this.onPress = this.onPress.bind(this);
    }

    public getTitle(): string {
        return this.title;
    }

    public getIcon(): string {
        return this.icon;
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public onPress(): void {
        if (this.action) {
            this.action();
        }
    }

    public init(): void {
        let buttonMarkup: string;

        switch (this.type) {
            case ButtonType.TEXT:
                buttonMarkup = `<button class="${this.classes.join(' ')}">${this.getTitle()}</button>`;
                break;
            case ButtonType.TEXT_WITH_ICON:
                buttonMarkup = `<button class="${this.classes.join(' ')}"><div>${this.getTitle()}</div><div class="${this.iconClasses.join(' ')}">${this.getIcon()}</div></button>`;
                break;
        }

        this.rootElement = Helper.DOM(buttonMarkup);
    }

    protected addEvents():void {
        this.rootElement.addEventListener('click', this.onPress);
    }

    protected removeEvents(): void {
        this.rootElement.removeEventListener('click', this.onPress);
    }

}