import {AbstractScene} from '../abstractScene';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import './style.styl';
import '../scene.styl';
import RegistrationForm from '../../widgets/form/registration';

export default class Registration extends AbstractScene {
	private background: HTMLImageElement;
	private formWidget: RegistrationForm;

	constructor(params: any) {
		super(params);

		this.onBack =  this.onBack.bind(this);
		this.onAuthorization = this.onAuthorization.bind(this);
	}

	public afterDOMShow() {
		super.afterDOMShow();
	}

	public beforeDOMShow() {
		super.beforeDOMShow();
	}

	public beforeDOMHide() {
		super.beforeDOMHide();
	}

	protected onBack(): void {
		return manager.goBack();
	}

	protected initBackground(): void {
		this.background = document.createElement('img');
		this.background.classList.add('scene__background');
		this.background.src = require('./background.png');
		this.contentWrapper.append(this.background);
	}

	protected initWidgets(): void {
		super.initWidgets();

		this.initBackground();
		this.initFormWidget();

		this.initFooter();
	}
    
	protected getTitle(): string {
		return 'Регистрация аккаунта';
	}

	private onAuthorization(): void {
		console.log('dsf')
	}

	private initFormWidget(): void {
		this.formWidget = new RegistrationForm({title: this.getTitle()});
		this.formWidget.init();
		this.contentWrapper.append(this.formWidget.getRoot());
		this.widgets.push(this.formWidget);
	}

	public open(): Promise<any> {
		return operator.getOperator()
			.then((response: Operator) => {
				this.operator = response;
				this.setOptions({operator: this.operator});
				this.initWidgets();

				if (!response.isDemo) {
					return user.getUser()
						.then((response: UserModel) => {
							this.user = response;
						})
						.catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
				}
			})
			.catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
	}


	protected setOptions(param: { user?: UserModel, operator?: Operator }) {
		if (this.options) {
			Object.assign(this.options, param);
		} else {
			this.options = param;
		}
	}

	protected getOptions(): any {
		return this.options;
	}
}
