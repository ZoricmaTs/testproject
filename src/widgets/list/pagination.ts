import AbstractWidget from '../abstractWidget';
import Btn, {ButtonType} from '../btn';

export enum POSITION {
	TOP = 'top',
	BOTTOM = 'bottom',
}
export default class Pagination extends AbstractWidget {
	protected page: number;
	protected quantity: number;
	protected rootElement: HTMLDivElement;
	protected nextButton: Btn;
	protected buttonsWrapper: HTMLDivElement;
	protected buttons: Btn[] = [];
	protected onChange: (page: number) => void;

	constructor(params: any) {
		super(params);
		
		this.page = params.page;
		this.quantity = params.quantity;
		this.onChange = params.onChange;
		this.onPressPage = this.onPressPage.bind(this);
	}

	public init(): void {
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('pagination');

		this.buttonsWrapper = document.createElement('div');
		this.buttonsWrapper.classList.add('pagination__buttons-wrapper');
		this.rootElement.append(this.buttonsWrapper);
		console.log('init pagination');
		this.initPageButtons();
		this.initNextButton();
	}

	public getRoot(): HTMLDivElement {
		return this.rootElement;
	}

	protected onPressPage(page: number): void {
		if (this.onChange) {
			this.onChange(page);
			this.setPage(page);
		}
	}

	protected updateActivePage(oldPage: number, newPage: number) {

	}

	protected initNextButton(): void {
		if (this.quantity > 4) {
			this.nextButton = new Btn({
				icon: 'arrow_forward',
				onPress: () => console.log('PRESS NEXT PAGE'),
				type: ButtonType.ICON,
				iconClasses: ['button__fill-icon', 'pagination__button-icon'],
				classes: ['pagination__button'],
				id: 'next_page',
			});

			this.nextButton.init();
			this.widgets.push(this.nextButton);
			this.buttonsWrapper.append(this.nextButton.getRoot());
		}
	}

	protected isActive(page: number): boolean {
		return this.page === page;
	}

	public setPage(page: number): void {
		this.page = page;
	}

	protected initPageButtons(): any {
		const quantityActivePage = this.quantity <= 4 ? this.quantity : 3;

		for (let i = 0; i < quantityActivePage; i += 1) {
			const button = new Btn({
				title: `${i + 1}`,
				classes: ['pagination__button'],
				id: `page-${i + 1}`,
				type: ButtonType.TEXT,
				onPress: () => this.onPressPage(i),
			});

			this.buttons.push(button);
		}

		this.buttons.forEach((button: Btn, index) => {
			this.widgets.push(button);

			button.init();

			if (this.isActive(index)) {
				button.getRoot().classList.add('active');
			}

			this.buttonsWrapper.append(button.getRoot());
		});

		if (this.quantity > 4) {
			const ellipsis = document.createElement('div');
			ellipsis.classList.add('pagination__ellipsis');
			ellipsis.innerText = '...';
			this.buttonsWrapper.append(ellipsis);

			const lastButton = new Btn({
				title: `${this.quantity}`,
				classes: ['pagination__button'],
				id: `page-${this.quantity}`,
				type: ButtonType.TEXT,
				onPress: () => console.log(`PRESS ${this.quantity} PAGE`),
			});

			this.widgets.push(lastButton);
			lastButton.init();
			this.buttonsWrapper.append(lastButton.getRoot());
		}
	}
}