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
    private values: { password: string; email: string };

    constructor(params: any) {
        super(params);

        this.values = {
            email: '',
            password: '',
        }

        this.openRegistration = this.openRegistration.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
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
                required: true,
                onChange: this.onChangeEmail,
            }),
            new Input({
                id: 'auth_password',
                name: 'password',
                value: this.values.password,
                type: InputType.PASSWORD,
                placeholder: 'password',
                required: true,
                onChange: this.onChangePassword,
            }),
        ];
    }

    private onChangeEmail(e: Event): void {
        const target = (e.target as HTMLInputElement);
        const isValid: boolean = target.validity.valid;

        if (isValid) {
            this.showHideError(false);
            this.values.email = target.value;
        } else {
            const validity: ValidityState = target.validity;
            this.checkInputValidate(InputType.EMAIL, validity);
        }
    }

    private onChangePassword(e: Event): void {
        const target = (e.target as HTMLInputElement);
        const isValid: boolean = target.validity.valid;

        if (isValid) {
            this.showHideError(false);
            this.values.password = target.value;
        } else {
            const validity: ValidityState = target.validity;
            this.checkInputValidate(InputType.PASSWORD, validity);
        }
    }

    protected initInputs(): void {
        this.inputs = this.createInputs();

        this.inputs.forEach((input: Input) => {
            input.init();
            this.rootElement.append(input.getRoot());
            this.widgets.push(input);
        });
    }

    protected onSubmit(e: Event): void {
        e.preventDefault();

        return user.getUser({email: this.values.email, password: this.values.password})
            .then((response: UserModel) => this.showHideError(false))
            .then(() => operator.isAuthorization())
            .then(() => manager.open(Scenes.HOME, {name: 'home', route: 'home'}))
            .catch((error: ErrorEvent) => {
                this.setError(error.message);
                this.showHideError(true);
            });
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');

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