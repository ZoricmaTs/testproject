import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';
import {manager, user} from '../../index';
import UserModel from '../../models/user';
import AbstractForm from './index';
import './style.styl';
import {Scenes} from '../../scenes/manager';


export default class AuthorizationForm extends AbstractForm {
    protected rootElement: HTMLFormElement;
    protected inputs: Input[];
    protected button: Btn;
    private email: string;
    private password: string;
    private regButton: Btn;

    constructor(params: any) {
        super(params);

        this.email = '';
        this.password = '';

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
    }

    public afterDOMHide() {
        super.afterDOMHide();
    }

    public beforeDOMHide() {
        super.beforeDOMHide();
    }

    protected createInputs(): Input[] {
        return [
            new Input({
                id: 'auth_email',
                name: 'email',
                value: this.email,
                type: InputType.EMAIL,
                placeholder: 'email',
                required: true,
                onChange: this.onChangeEmail,
            }),
            new Input({
                id: 'auth_password',
                name: 'password',
                value: this.password,
                type: InputType.PASSWORD,
                placeholder: 'password',
                required: true,
                onChange: this.onChangePassword,
            }),
        ];
    }

    private onChangeEmail(e: Event): void {
        this.email = (e.target as HTMLInputElement).value;
    }

    private onChangePassword(e: Event): void {
        this.password = (e.target as HTMLInputElement).value;
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

        return user.getUser({email: this.email, password: this.password})
            .then((response: UserModel) => {
                console.log('response', response);
            })
            .catch((error: ErrorEvent) => console.log('error form: ', error))
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');

        if (this.title) {
            this.initTitle();
        }

        this.initInputs();
        this.initSubmitButton();
        this.initRegistrationButton();
    }

    public getRoot() {
        return this.rootElement;
    }

    private openRegistration(): Promise<void> {
        this.email = '';
        this.password = '';

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