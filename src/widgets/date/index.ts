import AbstractWidget from '../abstractWidget';
import './style.styl';

export default class DateInput extends AbstractWidget {
    protected rootElement: HTMLDivElement;
    private datepicker: any;
    protected id: number;
    constructor(params: any) {
        super(params);

        this.id = params.id;

        this.onChange = this.onChange.bind(this);
    }

    protected getMonths(): string[] {
        return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    }

    protected getDays(): string[] {
        return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    }

    protected getStartDay(): number {
        return 1;
    }

    protected getOverlayMonths(): string[] {
        return ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    }

    protected onChange(input: any, date: any, instance: any): void {
        input.value = date.toLocaleDateString();
    }

    protected getOverlayPlaceholder(): string {
        return 'Введите 4-значный год';
    }

    public afterDOMShow() {
        super.afterDOMShow();
        const datepicker = require('js-datepicker');

        const options = {
            id: this.id,
            startDay: this.getStartDay(),
            formatter: this.onChange,
            customDays: this.getDays(),
            customMonths: this.getMonths(),
            customOverlayMonths: this.getOverlayMonths(),
            showAllDates: true,
            overlayPlaceholder: this.getOverlayPlaceholder(),
            overlayButton: 'Применить',
        };

        this.datepicker = datepicker(this.rootElement, options);
    }

    public init(): any {
        this.rootElement = document.createElement('input');
        this.rootElement.setAttribute('type', 'text');
        this.rootElement.classList.add('date');
    }

    public getRoot(): HTMLDivElement {
        return this.rootElement;
    }
}