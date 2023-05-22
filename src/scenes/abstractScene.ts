import AbstractWidget from '../widgets/abstractWidget';
import Header from '../widgets/header';
import UserModel from '../models/user';
import Operator from '../models/operator';
import {operator, user} from '../index';
import RoomModel from '../models/room';
import Footer from '../widgets/footer';

export class AbstractScene {
	public name: string;
	private root: HTMLDivElement;
	private readonly route: string;
	protected widgets: AbstractWidget[];
	protected options: any;
	protected isEndPositionScroll: boolean;
	protected header: Header;
	protected user: UserModel;
	protected operator: Operator;
	protected footer: Footer;

	constructor(params: any) {
		this.name = params.name;
		this.route = params.route;
		this.widgets = [];

		this.create();
		this.onScrollScene = this.onScrollScene.bind(this);
	}

	protected onScrollScene(ev: Event): void {
		const element = ev.target as HTMLDivElement;
		this.isEndPositionScroll = element.scrollHeight - element.scrollTop === element.clientHeight;
	}

	public getRoute(): string {
		return this.route;
	}

	public beforeDOMHide(): void {
		this.widgets.forEach((widget: AbstractWidget) => {
			widget.beforeDOMHide();
		})
	}

	public beforeDOMShow(): void {
		this.widgets.forEach((widget: AbstractWidget) => {
			widget.beforeDOMShow();
		});
	}

	public afterDOMHide(): void {
		this.widgets.forEach((widget: AbstractWidget) => {
			widget.afterDOMHide();
		});

		this.getContainer().removeEventListener("scroll", this.onScrollScene);
	}

	public afterDOMShow(): void {
		this.widgets.forEach((widget: AbstractWidget) => {
			widget.afterDOMShow();
		})

		this.getContainer().addEventListener("scroll", this.onScrollScene);
	}

	public getContainer(): HTMLElement {
		return this.root;
	}

	protected create(): void {
		this.root = document.createElement('div');
		this.root.classList.add(`scene`);
		this.root.classList.add(`scene__${this.name}`);
	}

	protected loadOperatorData(): Promise<any> {
		return operator.getOperator()
			.then((response: Operator) => {
				this.operator = response;
				this.setOptions({operator: this.operator});


				if (!response.isDemo) {
					return user.getUser()
						.then((response: UserModel) => {
								this.user = response;
						})
						.catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
				}
			});
	}

	public open(params?: any): Promise<any> {
		return this.loadOperatorData()
			.then(() => this.initWidgets())
			.catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
	}

	protected setOptions(param: { user?: UserModel, operator?: Operator, rooms?: RoomModel[]}) {
		if (this.options) {
			Object.assign(this.options, param);
		} else {
			this.options = param;
		}
	}

	protected getOptions(): any {
		return this.options;
	}

	protected initWidgets(): void {
		this.initHeader();
	}

	protected initHeader(): void {
		this.header = new Header({items: this.operator.getHeaderItems(), user: this.user, isDemo: this.operator.isDemo});
		this.header.init();
		this.getContainer().append(this.header.getRoot());
		this.widgets.push(this.header);
	}

	protected initFooter(): void {
		this.footer = new Footer({});

		this.footer.init();
		this.getContainer().append(this.footer.getRoot());
		this.widgets.push(this.footer);
	}
}