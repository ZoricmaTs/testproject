import Input, {InputType} from './index';
import './style.styl';


export default class DateInput extends Input {
    private datepicker: any;

    constructor(params: any) {
        super(params);

        this.type = params.type;
        this.id = params.id;
        this.name = params.name;
        this.value = params.value;
        this.title = params.title;
        this.setPlaceholder(params.placeholder);

        this.required = params.required;
        this.errors = [];

        this.onChangeValue = params.onChange;

        this.onChange = this.onChange.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }

    protected setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder ? placeholder : 'ДД.ММ.ГГГГ';
    }

    private getMonths(): string[] {
        return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    }

    private getDays(): string[] {
        return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    }

    private getStartDay(): number {
        return 1;
    }

    private getOverlayMonths(): string[] {
        return ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    }

    private getOverlayPlaceholder(): string {
        return 'Введите 4-значный год';
    }

    public afterDOMShow() {
        super.afterDOMShow();

        const datepicker = require('js-datepicker');

        const options = {
            id: this.id,
            startDay: this.getStartDay(),
            formatter: this.onChangeDate,
            customDays: this.getDays(),
            customMonths: this.getMonths(),
            customOverlayMonths: this.getOverlayMonths(),
            showAllDates: true,
            overlayPlaceholder: this.getOverlayPlaceholder(),
            overlayButton: 'Применить',
        };

        this.datepicker = datepicker(this.input, options);
    }

    public getType(): InputType {
        return this.type;
    }

    protected getValidateRules(): any {

    }

    protected onChange(e: Event): void {
        console.log('e', e.target)
        if (this.onChangeValue) {
            const value = (e.target as HTMLInputElement).value;
            const valid = (e.target as HTMLInputElement).validity.valid;
            this.onChangeValue(e);
            this.input.setAttribute('value', value);

            if (valid) {
                this.errors = [];
            }
        }
    }

    protected onChangeDate(input: any, date: any, instance: any): void {
        this.input.value = date.toLocaleDateString();
    }

    public getErrors(): string[] {
        return this.errors;
    }

    protected isErrorExist(value: string): boolean {
        return Boolean(this.errors.find((error: string) => error === value));
    }

    public checkValidity(): any {
        const isValid: boolean = /\d{2}\.\d{2}\.\d{4}/.test(this.input.value);

        // if (!isValid) {
        //     this.errors.push(Input.validateInputs[this.type].typeMismatch);
        // }
    }

    public init(): void {
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add(`input-${this.type}`);

        if (this.title) {
            this.initTitle();
        }

        this.createInput();
        this.rootElement.append(this.input);
    }

    public getRoot(): HTMLDivElement {
        return this.rootElement;
    }

    protected addEvents():void {
        this.input.addEventListener('input', this.onChange);
    }

    protected removeEvents(): void {
        this.input.removeEventListener('input', this.onChange);
    }
}