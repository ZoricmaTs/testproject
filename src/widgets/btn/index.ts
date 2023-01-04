import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';

export type ButtonParams = {
    title?: string,
    classes: string[],
    onPress: (params: any) => void,
    onBlur?: () => void,
    type: ButtonType,
    icon?: string,
    iconClasses?: string[],
    data?: any,
    isActive?: boolean,
}

export enum ButtonType {
    TEXT = 1,
    TEXT_WITH_ICON = 2,
}

export default class Btn extends AbstractWidget {
    private classes: string[];
    private readonly title: string;
    private rootElement: Element;
    private readonly onPressButton: (data: any) => void;
    private readonly data?: any
    private readonly type: ButtonType;
    private readonly icon: string;
    private iconClasses: string[];
    private readonly onBlurButton: () => void;
    private readonly isActive: boolean;

    constructor(params: ButtonParams) {
        super(params);
        this.data = params.data;
        this.isActive = params.isActive;
        this.title = params.title;
        this.icon = params.icon;
        this.classes = ['button'].concat(params.classes);
        this.type = params.type;
        this.iconClasses = params.iconClasses ? ['material-icons'].concat(params.iconClasses) : ['material-icons'];

        this.onPressButton = params.onPress;
        this.onBlurButton = params.onBlur;

        this.onPress = this.onPress.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    public beforeDOMShow() {
        super.beforeDOMShow();

        if (this.isActive) {
            this.setActive(this.isActive);
        }
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
        console.log('onPress btn', this.onPressButton)
        if (this.onPressButton) {
            this.onPressButton(this.data);
        }
    }

    public onBlur(): void {
        if (this.onBlurButton) {
            this.onBlurButton();
        }
    }

    public setActive(value: any): void {
        if (value) {
            this.getRoot().classList.add('active');
        } else {
            this.getRoot().classList.remove('active');
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
        if (this.onBlurButton) {
            this.rootElement.addEventListener('blur', this.onBlur);
        }
    }

    protected removeEvents(): void {
        this.rootElement.removeEventListener('click', this.onPress);
        if (this.onBlurButton) {
            this.rootElement.removeEventListener('blur', this.onBlur);
        }
    }

}