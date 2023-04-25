import Btn, {ButtonType} from '../btn';
import AbstractForm from './index';
import './style.styl';
import DateInput from '../input/date';
import {InputType} from '../input';
import MultipleDropdown, {MultiplyItem, MultiplyType} from '../dropdown/multiple';
import {manager, rooms} from '../../index';
import {Scenes} from '../../scenes/manager';

export type SearchParams = {
    from: Date,
    to: Date,
    guests?: {
        adults?: number,
        children?: number,
        babies?: number,
    }
}

export default class SearchForm extends AbstractForm {
    protected rootElement: HTMLFormElement;
    protected button: Btn;
    private readonly values: { arrivalDate: Date; departureDate: Date, guests: any};
    private datesWrapper: HTMLDivElement;
    private dropdown: MultipleDropdown;

    constructor(params: any) {
        super(params);

        this.values = {
            arrivalDate: undefined,
            departureDate: undefined,
            guests: '',
        }

        this.onChangeDropdownValues = this.onChangeDropdownValues.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    public afterDOMShow() {
        super.afterDOMShow();
    }

    public beforeDOMShow() {
        super.beforeDOMShow();

        this.setError(undefined);
    }

    public afterDOMHide() {
        super.afterDOMHide();
    }

    public beforeDOMHide() {
        super.beforeDOMHide();

        this.setError(undefined);
    }

    private getInputHandler<T extends keyof typeof this.values>(key: T): ((value: string, key: T) => void) {
        return (value: string) => this.onInput(value, key);
    }

    private onInput(value: string, key: keyof typeof this.values): void {
        this.values[key] = value;
    }

    private initDates(): void {
        this.datesWrapper = document.createElement('div');
        this.datesWrapper.classList.add('form__dates-wrapper');

        const datesData = [
            {
                id: 1,
                title: 'прибытие',
                type: InputType.DATE,
                name: 'date',
                rules: {date: true, required: true},
                onChange: this.getInputHandler('arrivalDate'),
            },
            {
                id: 1,
                title: 'выезд',
                type: InputType.DATE,
                name: 'date',
                rules: {date: true, required: true},
                onChange: this.getInputHandler('departureDate'),
            },
        ]

        datesData.forEach((date: any) => {
            const dateInput = new DateInput(date);
            dateInput.init();

            this.datesWrapper.append(dateInput.getRoot());
            this.widgets.push(dateInput);
        });

        this.rootElement.append(this.datesWrapper);
    }

    protected onSubmit(e: Event): Promise<void> {
        e.preventDefault();

        return manager.open(Scenes.SEARCH, {name: 'search', route: 'search', params: {from: this.values.arrivalDate, to: this.values.departureDate}}).catch(null);
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');

        if (this.title) {
            this.initTitle();
        }

        this.initDates();
        this.initDropdown();
        this.initSubmitButton();
    }

    private getGuestsValue(data: MultiplyItem[]): string {
        const text: string[] = [];

        data.forEach((item: any) => {
            if (item.value > 0) {
                text.push(`${item.value} ${item.title}`);
            }
        });

        return text.join(', ');
    }

    private initDropdown(): void {
        const items: MultiplyItem[] = [
            {
                title: 'взрослые',
                value: 0,
                id: 'dropdown-125_0',
            },
            {
                title: 'дети',
                value: 0,
                id: 'dropdown-125_1',
            },
            {
                title: 'младенцы',
                value: 0,
                id: 'dropdown-125_2',
            }
        ];

        const data: MultiplyType = {
            id: `search-room`,
            name: 'гости',
            buttonTitle: 'Сколько гостей',
            existPlaceholder: true,
            items,
            onChange: this.onChangeDropdownValues,
            availabilityControlButtons: true,
        }

        this.dropdown = new MultipleDropdown(data);

        this.rootElement.append(this.dropdown.getRoot());
        this.widgets.push(this.dropdown);
    }

    private onChangeDropdownValues(data: MultiplyItem[]): void {
        console.log('onChangeDropdownValues', data);
        this.values.guests = data;
    }

    public getRoot() {
        return this.rootElement;
    }

    protected initSubmitButton(): void {
        this.button = new Btn({
            title: 'Подобрать номер',
            classes: ['button__fill', 'button__with-icon'],
            type: ButtonType.TEXT_WITH_ICON,
            icon: 'arrow_forward',
            iconClasses: ['button__fill-icon']
        });

        this.button.init();
        this.button.getRoot().setAttribute('type', 'submit');
        this.rootElement.append(this.button.getRoot());
        this.widgets.push(this.button);
    }

    protected addEvents():void {
        super.addEvents();
        this.rootElement.addEventListener('submit', this.onSubmit);
    }

    protected removeEvents() {
        super.removeEvents();
        this.rootElement.removeEventListener('submit', this.onSubmit);
    }
}