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
    buttonTitle: string,
    items: DropdownItem[],
    styles?: string[],
}

export default class MultipleDropdown extends AbstractWidget {
    protected rootElement: Element;
    protected items: any;
    protected readonly buttonTitle: string;
    protected buttons: Btn[];
    protected isOpen: boolean;
    protected toggle: Btn;
    protected list: Element;
    protected icon: string;
    protected id: number;
    protected readonly styles: string[];
    protected name: string;

    constructor(params: any) {
        super(params);

        this.name = params.name;
        this.id = params.id;
        this.items = params.items;
        this.buttonTitle = params.buttonTitle;
        // this.styles = params.styles;

        this.isOpen = false;

        this.icon = 'keyboard_arrow_down';

        this.onPressToggle = this.onPressToggle.bind(this);
        this.onBlur = this.onBlur.bind(this);


        this.initRootElement(this.styles);
        this.initToggle();

        this.initList();
        this.initItems();
    }

    protected initName(): void {
        const name = document.createElement('div');
        name.classList.add('multiply_name');
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
        if (this.buttons) {
            const isActive: boolean = this.hasActiveIndex();
            const toggleElement: Element = this.toggle.getRoot();

            if (isActive) {
                toggleElement.classList.add('active');
            } else {
                toggleElement.classList.remove('active');
            }
        }
    }

    protected initList(): void {
        this.list = Helper.DOM('<div class="multiply_list"></div>');
        this.list.classList.add('hide');
        this.rootElement.append(this.list);
        console.log('this.rootElement', this.rootElement.clientHeight)
    }

    protected initItems(): void {
        this.buttons = this.items.map(({title, onPress, isActive, data, id}: DropdownItem) => {
            const classes = ['multiply_list__item'];

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
            classes: ['multiply_toggle'],
            icon: this.icon,
            iconClasses: ['multiply_toggle__icon'],
        });

        this.toggle.init();
        this.changeToggleStyle();
        this.rootElement.append(this.toggle.getRoot());
        this.widgets.push(this.toggle);
    }

    protected initRootElement(stylesClass: string[]): void {
        const styles = stylesClass ? ['multiply'].concat(stylesClass) : ['multiply'];
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