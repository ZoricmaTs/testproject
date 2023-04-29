import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import Btn, {ButtonType} from '../btn';

export type DropdownItem = {
    title: string,
    onPress: (data: number) => void,
    isActive: boolean,
    data?: any,
    id: number,
}

export type DropdownType = {
    id: number,
    buttonTitle: string,
    items: DropdownItem[],
    styles?: string[],
}

export default class Dropdown extends AbstractWidget {
    protected rootElement: Element;
    protected items: DropdownItem[];
    protected readonly buttonTitle: string;
    protected buttons: Btn[];
    protected isOpen: boolean;
    protected toggle: Btn;
    protected list: Element;
    protected icon: string;
    public id: number;
    protected readonly styles: string[];

    constructor(params: DropdownType) {
        super(params);
        this.id = params.id;
        this.items = params.items;
        this.buttonTitle = params.buttonTitle;
        this.styles = params.styles;

        this.isOpen = false;

        this.icon = 'keyboard_arrow_down';

        this.onPressToggle = this.onPressToggle.bind(this);
        this.onBlur = this.onBlur.bind(this);


        this.initRootElement(this.styles);
        this.initList();
        this.initItems();
        this.initToggle();
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
        this.buttons.map((button: Btn) => {
            button.setActive(index === button.id);
        })
    }

    protected hasActiveIndex(): boolean {
        return Boolean(this.buttons.find((button: Btn) => button.getActive()));
    }

    protected changeToggleStyle(): void {
        const isActive: boolean = this.hasActiveIndex();
        const toggleElement: Element = this.toggle.getRoot();

        if (isActive) {
            toggleElement.classList.add('active');
        } else {
            toggleElement.classList.remove('active');
        }
    }

    protected initList(): void {
        this.list = Helper.DOM('<div class="dropdown_list"></div>');
        this.list.classList.add('hide');
        this.rootElement.append(this.list);
    }

    protected initItems(): void {
        this.buttons = this.items.map(({title, onPress, isActive, data, id}: DropdownItem) => {
            const classes = ['dropdown_list__item'];

            const button = new Btn({title, onPress, type: ButtonType.TEXT, classes, isActive, data, id})
            button.init();
            this.widgets.push(button);

            const buttonContainer = button.getRoot();
            this.list.append(buttonContainer);

            return button;
        });
    }

    protected showList(): void {
        this.list.classList.add('show');
        this.list.classList.remove('hide');

        this.icon = 'keyboard_arrow_up';
        this.toggle.setIcon(this.icon);
    }

    protected hideList(): void {
        this.list.classList.add('hide');
        this.list.classList.remove('show');

        this.icon = 'keyboard_arrow_down';
        this.toggle.setIcon(this.icon);
    }

    protected onPressToggle(): void {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.showList()
        } else {
            this.hideList();
        }
    }

    protected onBlur(e: Event): void {
        const isNodeContains = this.getRoot().contains(e.target);

        if (!isNodeContains) {
            this.hideList();
        }
    }

    protected initToggle(): void {
        this.toggle = new Btn({
            title: this.buttonTitle,
            onPress: this.onPressToggle,
            type: ButtonType.TEXT_WITH_ICON,
            classes: ['dropdown_toggle'],
            icon: this.icon,
        });

        this.toggle.init();
        this.changeToggleStyle();
        this.rootElement.append(this.toggle.getRoot());
        this.widgets.push(this.toggle);
    }

    protected initRootElement(stylesClass: string[]): void {
        const styles = stylesClass ? ['dropdown'].concat(stylesClass) : ['dropdown'];
        const classes = styles.join(' ');

        this.rootElement = Helper.DOM(`<div class="${classes}"/>`);
    }

    protected addEvents() {
        super.addEvents();
        window.addEventListener('click', this.onBlur);
    }

    protected removeEvents() {
        super.removeEvents();
        window.removeEventListener('click', this.onBlur);
    }
}