import AbstractWidget from '../abstractWidget';

export type ButtonParams = {
    id?: number | string,
    title?: string,
    classes: string[],
    onPress?: (params: any) => void,
    onBlur?: () => void,
    type: ButtonType,
    icon?: string,
    iconClasses?: string[],
    data?: any,
    isActive?: boolean,
}

export enum ButtonType {
    TEXT = 1,
    TEXT_WITH_ICON = 2,
		ICON = 3,
}

export default class Btn extends AbstractWidget {
	protected classes: string[];
	protected title: string;
	protected rootElement: Element;
	protected readonly onPressButton: (data: any) => void;
	public data?: any
	protected readonly type: ButtonType;
	protected icon: string;
	protected readonly iconClasses: string[];
	protected readonly onBlurButton: () => void;
	protected readonly isActive: boolean;
	public id: number | string;
	protected iconElement: Element;
	protected titleElement: HTMLDivElement;

	constructor(params: ButtonParams) {
		super(params);
		this.id = params.id;
		this.data = params.data;
		this.isActive = params.isActive;
		this.title = params.title;
		this.icon = params.icon;
		this.classes = ['button'].concat(params.classes);
		this.type = params.type;
		this.iconClasses = params.iconClasses ? ['material-icons', 'icon'].concat(params.iconClasses) : ['material-icons', 'icon'];

		this.onPressButton = params.onPress;

		if (params.onBlur) {
			this.onBlurButton = params.onBlur;
		}

		this.onPress = this.onPress.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	public beforeDOMShow() {
		super.beforeDOMShow();

		if (this.isActive) {
			this.setActive(this.isActive);
		}
	}

	public getTitle(): string {
		return this.title;
	}

	public setTitle(title: string): void {
		this.title = title;

		this.titleElement.innerText = this.title;
	}

	public getIcon(): string {
		return this.icon;
	}

	public setIcon(icon: string): void {
		this.icon = icon;

		this.iconElement.innerHTML = this.getIcon();
	}

	public getRoot(): any {
		return this.rootElement;
	}

	public onPress(): void {
		if (this.onPressButton) {
			this.onPressButton(this.data);
		}
	}

	public onBlur(): void {
		if (this.onBlurButton) {
			this.onBlurButton();
		}
	}

	public setActive(value: any): void {
		if (value) {
			this.getRoot().classList.add('active');
		} else {
			this.getRoot().classList.remove('active');
		}
	}

	public getActive(): boolean {
		return this.isActive;
	}

	public initIconElement(): void {
		this.iconElement = document.createElement('div');
		this.iconClasses.forEach((iconClass: string) => {
			this.iconElement.classList.add(iconClass);
		});

		this.iconElement.innerHTML = this.getIcon();

		this.getRoot().append(this.iconElement);
	}

	public init(): void {
		this.rootElement = document.createElement('button');
		this.classes.forEach((className: string) => {
			this.rootElement.classList.add(className);
		});

		if (this.type === ButtonType.TEXT_WITH_ICON || this.type === ButtonType.TEXT) {
			this.initTitleElement();
		}

		if (this.type === ButtonType.TEXT_WITH_ICON || this.type === ButtonType.ICON) {
			this.initIconElement();
		}
	}

	protected initTitleElement(): void {
		this.titleElement = document.createElement('div');
		this.titleElement.classList.add('title');
		this.titleElement.innerText = this.getTitle();

		this.rootElement.append(this.titleElement);
	}

	protected addEvents():void {
		this.rootElement.addEventListener('click', this.onPress);

		if (this.onBlurButton) {
			this.rootElement.addEventListener('blur', this.onBlur);
		}
	}

	protected removeEvents(): void {
		this.rootElement.removeEventListener('click', this.onPress);

		if (this.onBlurButton) {
			this.rootElement.removeEventListener('blur', this.onBlur);
		}
	}
}