import AbstractWidget from '../abstractWidget';
import './style.styl';
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
    title: string,
    items: DropdownItem[],
    styles?: string[],
}

export default class Dropdown extends AbstractWidget {
    private rootElement: Element;
    private items: DropdownItem[];
    private readonly title: string;
    private buttons: Btn[];
    private isOpen: boolean;
    private toggle: Btn;
    private list: Element;
    private icon: string;
    public id: number;
    private readonly styles: string[];
    private activeIndex: number;

    constructor(params: DropdownType) {
        super(params);
        this.id = params.id;
        this.items = params.items;
        this.title = params.title;
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

    private hasActiveIndex(): boolean {
        return Boolean(this.buttons.find((button: Btn) => button.getActive()));
    }

    private changeToggleStyle(): void {
        const isActive: boolean = this.hasActiveIndex();
        const toggleElement: Element = this.toggle.getRoot();

        if (isActive) {
            toggleElement.classList.add('active');
        } else {
            toggleElement.classList.remove('active');
        }
    }

    private initList(): void {
        this.list = Helper.DOM('<div class="dropdown_list"></div>');
        this.list.classList.add('hide');
        this.rootElement.append(this.list);
    }

    private initItems(): void {
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

    private showList(): void {
        this.list.classList.add('show');
        this.list.classList.remove('hide');

        this.icon = 'keyboard_arrow_up';
        this.toggle.setIcon(this.icon);
    }

    private hideList(): void {
        this.list.classList.add('hide');
        this.list.classList.remove('show');

        this.icon = 'keyboard_arrow_down';
        this.toggle.setIcon(this.icon);
    }

    private onPressToggle(): void {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.showList()
        } else {
            this.hideList();
        }
    }

    private onBlur(e: Event): void {
        const isNodeContains = this.getRoot().contains(e.target);

        if (!isNodeContains) {
            this.hideList();
        }
    }

    private initToggle(): void {
        this.toggle = new Btn({
            title: this.title,
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

    private initRootElement(stylesClass: string[]): void {
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