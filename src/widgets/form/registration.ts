import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';
import {manager} from '../../index';
import AbstractForm from './index';
import './style.styl';
import {Scenes} from '../../scenes/manager';
import RadioSelector from '../radio-selector';
import DateInput from '../input/date';

export default class RegistrationForm extends AbstractForm {
    protected rootElement: HTMLFormElement;
    protected inputs: Input[];
    protected button: Btn;
    private authButton: Btn;
    private values: { firstName: string; lastName: string, email: string, password: string };
    private radioSelector: RadioSelector;
    private birthDate: DateInput;

    constructor(params: any) {
        super(params);

        this.values = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        }

        this.openRegistration = this.openRegistration.bind(this);
        this.onChangeRadioBtn = this.onChangeRadioBtn.bind(this);

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

    protected createProfileInfoInputs(): Input[] | DateInput[] {
        return [
            new Input({
                id: 'reg_first-name',
                name: 'first-name',
                value: this.values.firstName,
                type: InputType.TEXT,
                placeholder: 'имя',
                required: true,
                onChange: this.getInputHandler('firstName', InputType.TEXT),
            }),
            new Input({
                id: 'reg_last-name',
                name: 'last-name',
                value: this.values.lastName,
                type: InputType.TEXT,
                placeholder: 'фамилия',
                required: true,
                onChange: this.getInputHandler('lastName', InputType.TEXT),
            }),
        ];
    }

    private onInput(e: Event, key: keyof typeof this.values, inputType: InputType): void {
        const target = (e.target as HTMLInputElement);
        const isValid: boolean = target.validity.valid;

        if (isValid) {
            this.showHideError(false);
            this.values[key] = target.value;
        } else {
            const validity: ValidityState = target.validity;
            this.checkInputValidate(inputType, validity);
        }
    }

    protected initProfileInfoInputs(): void {
        this.inputs = this.createProfileInfoInputs();

        this.inputs.forEach((input: Input) => {
            input.init();
            this.rootElement.append(input.getRoot());
            this.widgets.push(input);
        });
    }

    private getInputHandler<T extends keyof typeof this.values>(key: T, inputType: InputType): ((e: Event, key: T) => void) {
        return (e: Event) => this.onInput(e, key, inputType);
    }

    private createEmailInputs(): Input[] | DateInput[] {
        return [
            new Input({
                id: 'reg_email',
                name: 'email',
                value: this.values.email,
                type: InputType.EMAIL,
                placeholder: 'email',
                required: true,
                onChange: this.getInputHandler('email', InputType.EMAIL),
            }),
            new Input({
                id: 'reg_password',
                name: 'password',
                value: this.values.password,
                type: InputType.PASSWORD,
                placeholder: 'пароль',
                required: true,
                onChange: this.getInputHandler('password', InputType.PASSWORD),
            }),
        ];
    }
    private initEmailInputs(): void {
        this.inputs = this.createEmailInputs();

        this.inputs.forEach((input: Input) => {
            input.init();
            this.rootElement.append(input.getRoot());
            this.widgets.push(input);
        });
    }


    protected onSubmit(e: Event): void {
        e.preventDefault();

        // return user.getUser({email: this.values.email, password: this.values.password})
        //     .then((response: UserModel) => {
        //         this.showHideError(false);
        //         return response;
        //     })
        //     .then((response: UserModel) => operator.isAuthorization())
        //     .then(() => {
        //         localStorage.user = JSON.stringify({email: this.values.email, password: this.values.password});
        //
        //         return manager.open(Scenes.HOME, {name: 'home', route: 'home'});
        //     })
        //     .catch((error: ErrorEvent) => {
        //         this.setError(error.message);
        //         this.showHideError(true);
        //     });
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');

        if (this.title) {
            this.initTitle();
        }

        this.initProfileInfoInputs();
        this.initErrorMessage();

        this.initRadioButton();

        this.initBirthDate();

        this.initEmailInputs();

        this.initSubmitButton();
        this.initAuthorizationButton();
    }

    private initBirthDate(): void {
        this.birthDate = new DateInput({id: 1, title: 'дата рождения', type: InputType.DATE, name: 'date'});
        this.birthDate.init();
        this.rootElement.append(this.birthDate.getRoot());
        this.widgets.push(this.birthDate);
    }

    private onChangeRadioBtn(id: string): void {
        console.log('id', id);
    }

    private createRadioButton(): RadioSelector {
        return new RadioSelector({
            id: '123',
            title: 'кто ты',
            name: 'sdfsdf',
            onChange: this.onChangeRadioBtn,
            buttons: [
                {
                    id: '111',
                    label: 'мужчина',
                    value: 'мужчина',
                    checked: false,
                },
                {
                    id: '222',
                    label: 'ребёнок',
                    value: 'ребёнок',
                    checked: false,
                },
                {
                    id: '333',
                    label: 'Зус',
                    value: 'Зус',
                    checked: true,
                }
            ]
        });
    }

    public initRadioButton(): void {
        this.radioSelector = this.createRadioButton();
        this.radioSelector.init();

        this.rootElement.append(this.radioSelector.getRoot());
        this.widgets.push(this.radioSelector);
    }

    public getRoot() {
        return this.rootElement;
    }

    private openRegistration(): Promise<void> {
        this.values = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        };

        return manager.open(Scenes.REGISTRATION, {name: 'registration', route: 'registration'});
    }

    private initAuthorizationButton(): void {
        this.authButton = new Btn({
            title: 'войти',
            classes: ['button__stroke'],
            onPress: this.openRegistration,
            type: ButtonType.TEXT,
        });

        this.authButton.init();
        this.authButton.getRoot().setAttribute('type', 'button');
        const wrapper = document.createElement('div');
        wrapper.classList.add('form__button-wrapper');

        const text = document.createElement('p');
        text.classList.add('form__button-wrapper_text');
        text.innerText = 'Уже есть аккаунт на Toxin';

        wrapper.append(text);
        wrapper.append(this.authButton.getRoot());

        this.rootElement.append(wrapper);
        this.widgets.push(this.authButton);
    }

    protected initSubmitButton(): void {
        this.button = new Btn({
            title: 'Зарегистрироваться',
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