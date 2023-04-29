import AbstractWidget from '../abstractWidget';
import Btn, {ButtonParams, ButtonType} from '../btn';

export type MultiplyItem = {
    id: string,
    title: string,
    value: number,
}

export type MultiplyType = {
    id: number | string,
    buttonTitle: string,
    name?: string,
    items: MultiplyItem[],
    styles?: string[],
    onChange?: (items: any) => void,
    availabilityControlButtons?: boolean,
    existPlaceholder?: boolean,
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
    protected id: number | string;
    protected readonly styles: string[];
    protected name: string;
    protected onChange: any;
    protected availabilityControlButtons: boolean;

    constructor(params: MultiplyType) {
        super(params);

        this.name = params.name;
        this.id = params.id;
        this.items = params.items;
        this.buttonTitle = params.buttonTitle;
        // this.styles = params.styles;

        this.isOpen = false;

        this.icon = 'keyboard_arrow_down';
        this.onChange = params.onChange;
        this.availabilityControlButtons = params.availabilityControlButtons;

        this.onBlur = this.onBlur.bind(this);
        this.onPressToggle = this.onPressToggle.bind(this);
        this.onPressClearButton = this.onPressClearButton.bind(this);
        this.onPressApplyButton = this.onPressApplyButton.bind(this);

        this.initRootElement(this.styles);
        this.onChangeValueAugment = this.onChangeValueAugment.bind(this);
        this.onChangeValueSubtract = this.onChangeValueSubtract.bind(this);
        this.onChangeValues = this.onChangeValues.bind(this);
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

        if (this.availabilityControlButtons) {
            const wrapper = this.createControlWrapper();
            const clearButtonData = {
                wrapper,
                data: {
                    title: 'очистить',
                    onPress: this.onPressClearButton,
                    type: ButtonType.TEXT,
                    classes: ['multiply_list__control_button']
                },
                parentElement: this.list
            };

            const applyButtonData = {
                wrapper,
                data: {
                    title: 'применить',
                    onPress: this.onPressApplyButton,
                    type: ButtonType.TEXT,
                    classes: ['multiply_list__control_button']
                },
                parentElement: this.list
            };

            this.initButton(clearButtonData);
            this.initButton(applyButtonData);
        }
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

    protected onChangeValueAugment(data: any): void {
        const newValue = this.items.find((item: any) => item.id === data.id).value + 1;
        this.setValue(data.id, newValue);
    }

    protected setValue(id: string, newValue: number) {
        const wrapper = document.getElementById(id);
        const currentValue = this.items.find((item: any) => item.id === id);
        currentValue.value = newValue;
        wrapper.innerText = `${newValue}`;

        this.items.forEach((item: any) => {
            if (item.id === id) {
                item.value = newValue;
            }
        });

        const button = document.getElementById(`minus-${id}`) as HTMLButtonElement;
        button.disabled = newValue === 0 ;

        if (!this.availabilityControlButtons) {
            this.onChangeValues(this.items);
        }
    }

    protected onChangeValueSubtract(data: any): void {
        const currentItem = this.items.find((item: any) => item.id === data.id)
        const currentValue = currentItem.value;

        if (currentValue > 0) {
            const newValue = currentValue - 1;
            this.setValue(data.id, newValue);
        }
    }

    protected onChangeValues(data: any): void {
        if (this.onChange) {
            this.onChange(data);
        }

        const text: string[] = [];

        data.forEach((item: any) => {
            if (item.value > 0) {
                text.push(`${item.value} ${item.title}`);
            }
        });

        this.toggle.setTitle(text.join(', '));
    }

    protected initItemButtons(item: any, itemWrapper: HTMLDivElement): void {
        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.classList.add('multiply_list__item_buttons-wrapper');

        const value = document.createElement('div');
        value.classList.add('multiply_list__item_value');
        value.setAttribute('id', item.id);
        value.innerText = item.value;

        const buttons = [
            new Btn ({
                title: '-',
                type: ButtonType.TEXT,
                id: `minus-${item.id}`,
                onPress: () => this.onChangeValueSubtract(item),
                data: [],
                classes: ['multiply_list__item_button'],
            }),
            new Btn ({
                title: '+',
                type: ButtonType.TEXT,
                id: `plus-${item.id}`,
                onPress: () => this.onChangeValueAugment(item),
                data: [],
                classes: ['multiply_list__item_button'],
            })
        ];

        buttons.forEach((button: Btn, index: number) => {
            button.init();
            button.getRoot().setAttribute('id', String(button.id));

            if (index === 0) {
                button.getRoot().disabled = true;
            }

            button.getRoot().setAttribute('type', 'button');
            button.beforeDOMShow();
            this.widgets.push(button);

            button.afterDOMShow();
        });

        buttonsWrapper.append(buttons[0].getRoot());
        buttonsWrapper.append(value);
        buttonsWrapper.append(buttons[1].getRoot());

        itemWrapper.append(buttonsWrapper);
    }

    protected initItems(): void {
        this.items.forEach((item: any) => {
            const itemWrapper = document.createElement('div');
            itemWrapper.classList.add('multiply_list__item');

            const title = document.createElement('div');
            title.classList.add('multiply_list__item_title');
            title.innerText = item.title;
            itemWrapper.append(title);

            this.initItemButtons(item, itemWrapper);

            this.list.append(itemWrapper);
        })
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
        });

        this.toggle.init();
        this.toggle.beforeDOMShow();
        this.toggle.getRoot().setAttribute('type', 'button');
        this.changeToggleStyle();

        this.rootElement.append(this.toggle.getRoot());
        this.widgets.push(this.toggle);

        this.toggle.afterDOMShow();
    }

    protected onPressClearButton(): void {
        this.items.forEach((item: any) => {
            this.setValue(item.id, 0);
        });

        this.onChangeValues(this.items);
    }

    protected onPressApplyButton(): void {
        this.onChangeValues(this.items);
    }

    protected createControlWrapper(): HTMLDivElement {
        const controlButtonsWrapper = document.createElement('div');
        controlButtonsWrapper.classList.add('multiply_list__control_wrapper');

        return controlButtonsWrapper;
    }

    protected initButton({wrapper, data, parentElement}: {wrapper: HTMLDivElement, data: ButtonParams, parentElement: HTMLDivElement}): void {
        const button = new Btn(data);

        button.init();
        button.beforeDOMShow();
        button.getRoot().setAttribute('type', 'button');

        wrapper.append(button.getRoot());

        button.afterDOMShow();

        parentElement.append(wrapper);
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