import AbstractWidget from '../abstractWidget';
import './style.styl';
import * as Helper from '../../helper';
import Btn, {ButtonType} from '../btn';

export type DropdownItem = {
    title: string,
    onPress: (data: number) => void,
    isActive: boolean,
    data?: number
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
    private list: Element;

    constructor(params: DropdownType) {
        super(params);
        this.items = params.items;
        this.title = params.title;
        this.isOpen = false;
        this.initRootElement();

        this.initList();

        this.onPressToggle = this.onPressToggle.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.initToggle();

        this.initItems();

        // this.onPressItem = this.onPressItem.bind(this);
    }

    public beforeDOMHide() {
        super.beforeDOMHide();
    }

    public beforeDOMShow() {
        super.beforeDOMShow();
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public setActiveIndex(index: number): void {
        this.buttons.map((button, i) => {
            button.setActive(index === i);
        })
    }

    private initList(): void {
        this.list = Helper.DOM('<div class="dropdown_list"></div>');
        this.list.classList.add('hide');
        this.rootElement.append(this.list);
    }

    private initItems(): void {
        this.buttons = this.items.map(({title, onPress, isActive}: DropdownItem) => {
            const classes = ['dropdown_list__item'];

            return new Btn({title, onPress, type: ButtonType.TEXT, classes: classes, data: isActive})
        })

        this.buttons.map((button) => button.init());
        this.buttons.forEach((button) => {
            const buttonContainer = button.getRoot();
            this.list.append(buttonContainer);
            this.widgets.push(button);
        })
    }

    private showList(): void {
        this.list.classList.add('show');
        this.list.classList.remove('hide');
    }

    private hideList(): void {
        this.list.classList.add('hide');
        this.list.classList.remove('show');
    }

    private onPressToggle(): void {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.showList()
        } else {
            this.hideList();
        }
    }

    private onBlur(): void {
        this.hideList();
    }

    private initToggle(): void {
        this.toggle = new Btn({
            title: this.title,
            onPress: this.onPressToggle,
            onBlur: this.onBlur,
            type: ButtonType.TEXT_WITH_ICON,
            classes: ['dropdown_toggle'],
            icon: 'keyboard_arrow_down',
        });

        this.toggle.init();
        this.rootElement.append(this.toggle.getRoot());
        this.widgets.push(this.toggle);
    }

    private initRootElement(): void {
        this.rootElement = Helper.DOM('<div class="dropdown"></div>');
    }

    public init(): void {}
}