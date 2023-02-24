import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import AbstractForm from './index';
import './style.styl';
import {Scenes} from '../../scenes/manager';
import RadioSelector from '../radio-selector';

export default class RegistrationForm extends AbstractForm {
    protected rootElement: HTMLFormElement;
    protected inputs: Input[];
    protected button: Btn;
    private authButton: Btn;
    private values: { firstName: string; lastName: string };
    private radioSelector: RadioSelector;

    constructor(params: any) {
        super(params);

        this.values = {
            firstName: '',
            lastName: '',
        }

        this.openRegistration = this.openRegistration.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
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

    protected createInputs(): Input[] {
        return [
            new Input({
                id: 'reg_first-name',
                name: 'first-name',
                value: this.values.firstName,
                type: InputType.TEXT,
                placeholder: 'имя',
                required: true,
                onChange: this.onChangeFirstName,
            }),
            new Input({
                id: 'reg_last-name',
                name: 'last-name',
                value: this.values.lastName,
                type: InputType.TEXT,
                placeholder: 'фамилия',
                required: true,
                onChange: this.onChangeLastName,
            }),
        ];
    }

    private onChangeFirstName(e: Event): void {
        const target = (e.target as HTMLInputElement);
        const isValid: boolean = target.validity.valid;

        if (isValid) {
            this.showHideError(false);
            this.values.firstName = target.value;
        } else {
            const validity: ValidityState = target.validity;
            this.checkInputValidate(InputType.TEXT, validity);
        }
    }

    private onChangeLastName(e: Event): void {
        const target = (e.target as HTMLInputElement);
        const isValid: boolean = target.validity.valid;

        if (isValid) {
            this.showHideError(false);
            this.values.lastName = target.value;
        } else {
            const validity: ValidityState = target.validity;
            this.checkInputValidate(InputType.TEXT, validity);
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

        this.initInputs();
        this.initErrorMessage();
        this.initRadioButton();
        this.initSubmitButton();
        this.initAuthorizationButton();
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

        this.getRoot().append(this.radioSelector.getRoot());
        this.widgets.push(this.radioSelector);
    }

    public getRoot() {
        return this.rootElement;
    }

    private openRegistration(): Promise<void> {
        this.values = {
            firstName: '',
            lastName: '',
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