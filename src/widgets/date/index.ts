import AbstractWidget from '../abstractWidget';
import './style.styl';

export default class DateAbstract extends AbstractWidget {
    protected rootElement: HTMLDivElement;
    private datepicker: any;
    constructor(params: any) {
        super(params);
    }

    public afterDOMShow() {
        super.afterDOMShow();
        const datepicker = require('js-datepicker');

        const options = {
            id: 1,
            startDay: 1,
            formatter: (input: any, date: any, instance: any) => {
                input.value = date.toLocaleDateString()
            },
            customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            overlayButton: 'Применить',
            customOverlayMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            alwaysShow: true,
            showAllDates: true,
            overlayPlaceholder: 'Введите 4-значный год',
        };
        this.datepicker = datepicker(this.rootElement, options);

        // this.datepicker.calendarContainer.style.setProperty('top', '6px')
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