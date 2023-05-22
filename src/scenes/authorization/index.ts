import {AbstractScene} from '../abstractScene';
import {manager} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import './style.styl';
import '../scene.styl';
import AuthorizationForm from '../../widgets/form/authorization';

export default class Authorization extends AbstractScene {
	private background: HTMLImageElement;
	private contentWrapper: HTMLDivElement;
	private formWidget: AuthorizationForm;

	constructor(params: any) {
		super(params);

		this.onBack =  this.onBack.bind(this);
		this.onAuthorization = this.onAuthorization.bind(this);
	}

	afterDOMShow() {
		super.afterDOMShow();
	}

	beforeDOMShow() {
		super.beforeDOMShow();
	}

	beforeDOMHide() {
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

		this.initContentWrapper();
		this.initBackground();
		this.initFormWidget();

		this.initFooter();
	}

	protected getTitle(): string {
		return 'Войти';
	}

	private onAuthorization(): void {
		console.log('dsf')
	}

	private initFormWidget(): void {
		this.formWidget = new AuthorizationForm({title: this.getTitle()});
		this.formWidget.init();
		this.contentWrapper.append(this.formWidget.getRoot());
		this.widgets.push(this.formWidget);
	}

	private initContentWrapper(): void {
		this.contentWrapper = document.createElement('div');
		this.contentWrapper.classList.add(`scene__${this.name}_content-wrapper`);
		this.getContainer().append(this.contentWrapper);
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
