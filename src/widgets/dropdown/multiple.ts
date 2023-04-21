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
    protected list: HTMLDivElement;
    protected icon: string;
    protected id: number;
    protected readonly styles: string[];
    protected name: string;
    private aa: any;

    constructor(params: any) {
        super(params);

        this.name = params.name;
        this.id = params.id;
        this.items = params.items;
        this.buttonTitle = params.buttonTitle;
        // this.styles = params.styles;

        this.isOpen = false;

        this.icon = 'keyboard_arrow_down';

        this.onBlur = this.onBlur.bind(this);
        this.onPressToggle = this.onPressToggle.bind(this);
        this.initRootElement(this.styles);
    }

    protected initName(): void {
        const name = document.createElement('div');
        name.classList.add('multiply_name');
        name.innerText = this.name;

        this.rootElement.append(name);
    }

    public beforeDOMHide() {
        super.beforeDOMHide();
    }

    public beforeDOMShow() {
        super.beforeDOMShow();
    }

    public afterDOMShow() {
        super.afterDOMShow();

        if (this.name && this.name.length > 0) {
            this.initName();
        }

        this.initToggle();
        this.initList();
        this.initItems();
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
        this.list = document.createElement('div');
        this.list.classList.add('hide', 'multiply_list');
        this.rootElement.append(this.list);
        this.list.style.top = `${this.rootElement.clientHeight}px`;
    }

    protected initItems(): void {
        this.items.forEach((item: any, index: number) => {
            const itemWrapper = document.createElement('div');
            itemWrapper.classList.add('multiply_list__item');

            const title = document.createElement('div');
            title.classList.add('multiply_list__item_title');
            title.innerText = item.title;
            itemWrapper.append(title);

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.classList.add('multiply_list__item_buttons-wrapper');

            const subtractButton = new Btn({
                title: '-',
                type: ButtonType.TEXT,
                id: `minus-${index}`,
                onPress: () => console.log('minus'),
                data: [],
                classes: ['multiply_list__item_button'],
            });

            const augmentButton = new Btn({
                title: '+',
                type: ButtonType.TEXT,
                id: `plus-${index}`,
                onPress: () => console.log('plus'),
                data: [],
                classes: ['multiply_list__item_button'],
            });

            subtractButton.init();
            augmentButton.init();

            subtractButton.beforeDOMShow();
            augmentButton.beforeDOMShow();

            this.widgets.push(subtractButton);
            this.widgets.push(augmentButton);

            subtractButton.afterDOMShow();
            augmentButton.afterDOMShow();

            const value = document.createElement('div');
            value.classList.add('multiply_list__item_value');
            value.innerText = item.value;

            buttonsWrapper.append(subtractButton.getRoot());
            buttonsWrapper.append(value);
            buttonsWrapper.append(augmentButton.getRoot());

            itemWrapper.append(buttonsWrapper);

            this.list.append(itemWrapper);
        })


        // this.buttons = this.items.map(({title, onPress, isActive, data, id}: DropdownItem) => {
        //     const classes = ['multiply_list__item'];
        //
        //     const button = new Btn({title, onPress, type: ButtonType.TEXT, classes, isActive, data, id})
        //     button.init();
        //     this.widgets.push(button);
        //
        //     const buttonContainer = button.getRoot();
        //     this.list.append(buttonContainer);
        //
        //     return button;
        // });
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
            this.showList();
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
        })
        this.toggle.init();
        this.toggle.beforeDOMShow();

        this.changeToggleStyle();

        this.rootElement.append(this.toggle.getRoot());
        this.widgets.push(this.toggle);

        this.toggle.afterDOMShow();
    }

    protected initRootElement(stylesClass: string[]): void {
        const styles = stylesClass ? ['multiply'].concat(stylesClass) : ['multiply'];
        const classes = styles.join(' ');

        this.rootElement = document.createElement('div');
        this.rootElement.classList.add(classes);
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