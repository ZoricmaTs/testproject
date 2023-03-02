// import AbstractWidget from '../abstractWidget';
// import './style.styl';
//
// export type DateInputType = {
//     id: number,
//     title?: string,
//     required?: boolean,
// }
//
// export default class DateInput extends AbstractWidget {
//     protected rootElement: HTMLDivElement;
//     protected datepicker: any;
//     protected id: number;
//     protected inputElement: HTMLInputElement;
//     protected titleElement: HTMLDivElement;
//     protected title: string;
//     protected required: boolean;
//     constructor(params: DateInputType) {
//         super(params);
//
//         this.id = params.id;
//         this.title = params.title;
//         this.required = params.required;
//
//         this.onChange = this.onChange.bind(this);
//         this.onFormatter = this.onFormatter.bind(this);
//     }
//
//     protected getMonths(): string[] {
//         return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
//     }
//
//     protected getDays(): string[] {
//         return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
//     }
//
//     protected getStartDay(): number {
//         return 1;
//     }
//
//     protected getOverlayMonths(): string[] {
//         return ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
//     }
//
//     protected onFormatter(input: any, date: any, instance: any): void {
//         input.value = date.toLocaleDateString();
//     }
//     //
//     // protected onChange(e: Event): void {
//     //     console.log('e',e.target);
//     // //     if (this.onChangeValue) {
//     // //         const value = (e.target as HTMLInputElement).value;
//     // //         const valid = (e.target as HTMLInputElement).validity.valid;
//     // //         this.onChangeValue(e);
//     // //         this.input.setAttribute('value', value);
//     // //
//     // //         if (valid) {
//     // //             this.errors = [];
//     // //         }
//     // //     }
//     // }
//
//     protected getOverlayPlaceholder(): string {
//         return 'Введите 4-значный год';
//     }
//
//     protected validate(): void {
//         if (this.required) {
//             this.inputElement.required = this.required;
//         }
//     }
//
//     public afterDOMShow() {
//         super.afterDOMShow();
//
//         if (this.title) {
//             this.initTitle();
//         }
//
//         this.initInput();
//
//         const datepicker = require('js-datepicker');
//
//         const options = {
//             id: this.id,
//             startDay: this.getStartDay(),
//             formatter: this.onFormatter,
//             customDays: this.getDays(),
//             customMonths: this.getMonths(),
//             customOverlayMonths: this.getOverlayMonths(),
//             showAllDates: true,
//             overlayPlaceholder: this.getOverlayPlaceholder(),
//             overlayButton: 'Применить',
//         };
//
//         this.datepicker = datepicker(this.inputElement, options);
//     }
//
//     public init(): any {
//         this.rootElement = document.createElement('div');
//         this.rootElement.classList.add('date');
//     }
//
//     protected initTitle(): void {
//         this.titleElement = document.createElement('div');
//         this.titleElement.classList.add('date__title');
//         this.titleElement.innerText = this.title;
//         this.getRoot().append(this.titleElement);
//     }
//
//     protected initInput(): any {
//         this.inputElement = document.createElement('input');
//         this.inputElement.setAttribute('type', 'text');
//         this.inputElement.classList.add(`input-date`);
//
//         this.validate();
//
//         this.getRoot().append(this.inputElement);
//     }
//
//     public getRoot(): HTMLDivElement {
//         return this.rootElement;
//     }
//
//     // protected addEvents():void {
//     //     this.inputElement.addEventListener('input', this.onChange);
//     // }
//     //
//     // protected removeEvents(): void {
//     //     this.inputElement.removeEventListener('input', this.onChange);
//     // }
// }