import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import AbstractForm from './index';
import './style.styl';
import {Scenes} from '../../scenes/manager';

export default class AuthorizationForm extends AbstractForm {
	protected rootElement: HTMLFormElement;
	protected inputs: Input[];
	protected button: Btn;
	private regButton: Btn;
	protected values: { password: string; email: string };

	constructor(params: any) {
		super(params);

    this.values = {
			email: '',
			password: '',
    }

    this.openRegistration = this.openRegistration.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
	}

	public afterDOMShow() {
    super.afterDOMShow();
	}

	public beforeDOMShow() {
    super.beforeDOMShow();

    this.setError(undefined);
	}

	public afterDOMHide() {
    super.afterDOMHide();
	}

	public beforeDOMHide() {
    super.beforeDOMHide();

    this.setError(undefined);
	}

	protected createInputs(): Input[] {
    return [
			new Input({
				id: 'auth_email',
				name: 'email',
				value: this.values.email,
				type: InputType.EMAIL,
				placeholder: 'email',
				rules: {
					required: true,
				},
				onChange: this.getInputHandler('email'),
			}),
			new Input({
				id: 'auth_password',
				name: 'password',
				value: this.values.password,
				type: InputType.PASSWORD,
				placeholder: 'password',
				rules: {
					required: true,
				},
				onChange: this.getInputHandler('password'),
			}),
    ];
	}

	protected initInputs(): void {
    this.inputs = this.createInputs();

    this.inputs.forEach((input: Input) => {
			input.init();
			this.rootElement.append(input.getRoot());
			this.widgets.push(input);
    });
	}


	protected onSubmit(e: Event): Promise<void> {
    e.preventDefault();

		return this.checkInputsErrors()
			.then(() => user.getUser(this.values))
			.then((response: UserModel) => {
				this.showHideError(false);

				return response;
			})
			.then((response: UserModel) => operator.isAuthorization())
			.then(() => {
				localStorage.user = JSON.stringify({email: this.values.email, password: this.values.password});
            return manager.open(Scenes.HOME, {name: 'home', route: 'home'});
        })
			.catch((error: ErrorEvent) => {
				this.setError(error.message);
				this.showHideError(true);
			})
	}

	public init(): void {
    this.rootElement = document.createElement('form');
    this.rootElement.classList.add('form', 'form-authorization');

    if (this.title) {
			this.initTitle();
    }

    this.initInputs();
    this.initErrorMessage();

    this.initSubmitButton();
    this.initRegistrationButton();
	}

	public getRoot() {
    return this.rootElement;
	}

	private openRegistration(): Promise<void> {
    this.values = {
			email: '',
			password: '',
    };

    return manager.open(Scenes.REGISTRATION, {name: 'registration', route: 'registration'});
	}

	private initRegistrationButton(): void {
    this.regButton = new Btn({
			title: 'создать',
			classes: ['button__stroke'],
			onPress: this.openRegistration,
			type: ButtonType.TEXT,
		});

    this.regButton.init();
    this.regButton.getRoot().setAttribute('type', 'button');
    const wrapper = document.createElement('div');
    wrapper.classList.add('form__button-wrapper');

    const text = document.createElement('p');
    text.classList.add('form__button-wrapper_text');
    text.innerText = 'Нет аккаунта на Toxin?';

    wrapper.append(text);
    wrapper.append(this.regButton.getRoot());

    this.rootElement.append(wrapper);
    this.widgets.push(this.regButton);
	}

	protected initSubmitButton(): void {
    this.button = new Btn({
			title: 'Войти',
			classes: ['button__fill', 'button__with-icon', 'form__auth-button'],
			type: ButtonType.TEXT_WITH_ICON,
			icon: 'arrow_forward',
			iconClasses: ['button__fill-icon']
    });

    this.button.init();
    this.button.getRoot().setAttribute('type', 'submit');
    this.rootElement.append(this.button.getRoot());
    this.widgets.push(this.button);
	}

	protected addEvents():void {
    super.addEvents();
    this.rootElement.addEventListener('submit', this.onSubmit);
	}

	protected removeEvents() {
    super.removeEvents();
    this.rootElement.removeEventListener('submit', this.onSubmit);
	}
}