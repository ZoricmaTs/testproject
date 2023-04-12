import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';
import {manager, operator, user} from '../../index';
import AbstractForm from './index';
import './style.styl';
import {Scenes} from '../../scenes/manager';
import RadioSelector, {ItemParams} from '../radio-selector';
import DateInput from '../input/date';
import UserModel from '../../models/user';

export default class RegistrationForm extends AbstractForm {
    protected rootElement: HTMLFormElement;
    protected inputs: Input[];
    protected button: Btn;
    private authButton: Btn;
    private values: { firstName: string; lastName: string, email: string, password: string, birthDate: string, gender: string};
    private radioSelector: RadioSelector;
    private date: DateInput;

    constructor(params: any) {
        super(params);

        this.getInputHandler = this.getInputHandler.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onRegistration = this.onRegistration.bind(this);
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
                rules: {
                    // required: true,
                    maxLength: 255,
                    minLength: 4,
                },
                onChange: this.getInputHandler('firstName'),
            }),
            new Input({
                id: 'reg_last-name',
                name: 'last-name',
                value: this.values.lastName,
                type: InputType.TEXT,
                placeholder: 'фамилия',
                rules: {
                    // required: true,
                    maxLength: 255,
                    minLength: 4,
                },
                onChange: this.getInputHandler('lastName'),
            }),
        ];
    }

    private onInput(value: string, key: keyof typeof this.values): void {
        this.values[key] = value;
    }

    protected initProfileInfoInputs(): void {
        this.inputs = this.createProfileInfoInputs();

        this.inputs.forEach((input: Input) => {
            input.init();
            this.rootElement.append(input.getRoot());
            this.widgets.push(input);
        });
    }

    private getInputHandler<T extends keyof typeof this.values>(key: T): ((value: string, key: T) => void) {
        return (value: string) => this.onInput(value, key);
    }

    private createEmailInputs(): Input[] | DateInput[] {
        return [
            new Input({
                id: 'reg_email',
                name: 'email',
                value: this.values.email,
                type: InputType.EMAIL,
                placeholder: 'email',
                rules: {
                    email: true,
                    required: true,
                },
                onChange: this.getInputHandler('email'),
            }),
            new Input({
                id: 'reg_password',
                name: 'password',
                value: this.values.password,
                type: InputType.PASSWORD,
                placeholder: 'пароль',
                rules: {
                    required: true,
                    maxLength: 255,
                    minLength: 8,
                },
                onChange: this.getInputHandler('password'),
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
        console.log('values onSubmit', this.values);
        return user.addUser({
            email: this.values.email,
            password: this.values.password,
            firstName: this.values.firstName,
            lastName: this.values.lastName,
            birthDate: this.values.birthDate,
            gender: this.values.gender,
        })
            .then((response: UserModel) => operator.isAuthorization())
            .then(() => {
                localStorage.user = JSON.stringify(this.values);

                return manager.open(Scenes.HOME, {name: 'home', route: 'home'});
            })
            .catch((error: ErrorEvent) => {
                // this.setError(error.message);
                // this.showHideError(true);
            });
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');

        if (this.title) {
            this.initTitle();
        }

        this.values = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: '',
            gender: this.getDefaultGender().value,
        };

        this.initProfileInfoInputs();
        this.initErrorMessage();

        this.initRadioButton();

        this.initBirthDate();

        this.initEmailInputs();

        this.initSubmitButton();
        this.initAuthorizationButton();
    }

    private initBirthDate(): void {
        this.date = new DateInput({
            id: 1,
            title: 'дата рождения',
            type: InputType.DATE,
            name: 'date',
            rules: {
                date: true
            },
            onChange: this.getInputHandler('birthDate'),
        });

        this.date.init();
        this.rootElement.append(this.date.getRoot());
        this.widgets.push(this.date);
    }

    private onChangeRadioBtn(id: string): void {
        this.values.gender = this.getDataGenderButtons().find(item => item.id === id).value;
    }

    private getDataGenderButtons(): ItemParams[] {
        return [
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
        ];
    }

    private getDefaultGender(): ItemParams {
        return this.getDataGenderButtons().find((item: any) => item.checked);
    }

    private createRadioButton(): RadioSelector {
        return new RadioSelector({
            id: '123',
            title: 'кто ты',
            name: 'sdfsdf',
            onChange: this.onChangeRadioBtn,
            buttons: this.getDataGenderButtons()
        })
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

    private onRegistration(): Promise<void> {
        this.values = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: '',
            gender: this.getDefaultGender().value,
        };

        return manager.open(Scenes.REGISTRATION, {name: 'registration', route: 'registration'});
    }

    private initAuthorizationButton(): void {
        this.authButton = new Btn({
            title: 'войти',
            classes: ['button__stroke'],
            onPress: this.onRegistration,
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