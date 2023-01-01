import AbstractWidget from '../abstractWidget';
import './style.styl';
import * as Helper from '../../helper';
import Btn, {ButtonType} from '../btn';

export type DropdownItem = {
    title: string,
    action: () => void,
    isActive: boolean,
}

export type DropdownType = {
    title: string,
    items: DropdownItem[],
}



export default class Dropdown extends AbstractWidget {
    private rootElement: Element;
    private items: DropdownItem[];
    private readonly title: string;
    private buttons: Btn[];
    private isOpen: boolean;
    private toggle: Btn;

    constructor(params: DropdownType) {
        super(params);
        this.items = params.items;
        this.title = params.title;
        this.isOpen = false;
        this.initRootElement();

        this.initToggle();

        this.onPressToggle = this.onPressToggle.bind(this);
    }

    public getRoot(): any {
        return this.rootElement;
    }

    private initItems(): Btn[] {
        this.buttons = this.items.map(({title, action, isActive}: DropdownItem) => {
            return new Btn({title, action, type: ButtonType.TEXT, classes: ['dropdown-list__item']})
        });

        return this.buttons;
    }

    private onPressToggle() {
        console.log('isOpen');
    }

    private initToggle(): Btn {
        this.toggle = new Btn({
            title: this.title,
            action: this.onPressToggle,
            type: ButtonType.TEXT_WITH_ICON,
            classes: ['dropdown_toggle'],
            icon: 'keyboard_arrow_down',
        });

        this.toggle.init();
        this.rootElement.append(this.toggle.getRoot());

        return this.toggle;
    }

    private initRootElement(): void {
        this.rootElement = Helper.DOM('<div class="dropdown"></div>');
    }

    public init(): void {}
}