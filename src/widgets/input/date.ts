import Input from './index';

export default class DateInput extends Input {
	private datepicker: any;

	constructor(params: any) {
		super(params);

		this.setPlaceholder(params.placeholder);

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

	private onChangeDate(input: any, date: Date, instance: any): void {
		this.input.value = date.toLocaleDateString();

		if (this.onChangeValue) {
			this.onChangeValue(date.getTime());
		}
	}

	public getValue(): string {
		return this.input.value;
	}

	public init(): void {
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add(`input-${this.type}`);

		if (this.title) {
			this.initTitle();
		}

		this.createInput();
		this.rootElement.append(this.input);

		this.createErrorsWrapper();
		this.rootElement.append(this.errorsElement);
	}

	public getRoot(): HTMLDivElement {
		return this.rootElement;
	}
}