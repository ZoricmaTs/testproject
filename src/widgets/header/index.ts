import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';


export type HeaderItem = {
    type: HeaderItems,
    title: string,
    action: () => void,
    dropdownItems?: []
}

export enum HeaderItems {
    LOGO,
    BUTTON,
    DROPDOWN,
}

export default class Header extends AbstractWidget {
    private rootElement: Element;
    private items: HeaderItem[];

    constructor(params: any) {
        super(params);

    }

    public getRoot(): any {
        return this.rootElement;
    }

    private getItems(): any {
        this.items = [
            {
                type: HeaderItems.BUTTON,
                title: 'о нас',
                action: () => console.log('о нас click'),
            },
            {
                type: HeaderItems.DROPDOWN,
                title: 'Услуги',
                action: () => console.log('Услуги click'),
            },
        ]
    }

    public init(): void {
        const markUp: string = `<header></header>`;

        this.rootElement = Helper.DOM(markUp);
    }

    protected addEvents():void {

    }

    protected removeEvents(): void {

    }

}