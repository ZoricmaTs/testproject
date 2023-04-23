import Btn from '../btn';
import AbstractForm from './index';
import './style.styl';
import DateInput from '../input/date';
import {InputType} from '../input';

export default class SearchForm extends AbstractForm {
    protected rootElement: HTMLFormElement;
    protected button: Btn;
    private readonly values: { arrivalDate: string; departureDate: string };
    private datesWrapper: HTMLDivElement;

    constructor(params: any) {
        super(params);

        this.values = {
            arrivalDate: '',
            departureDate: '',
        }

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

    private getInputHandler<T extends keyof typeof this.values>(key: T): ((value: string, key: T) => void) {
        return (value: string) => this.onInput(value, key);
    }

    private onInput(value: string, key: keyof typeof this.values): void {
        this.values[key] = value;
    }

    private initDates(): void {
        this.datesWrapper = document.createElement('div');
        this.datesWrapper.classList.add('form__dates-wrapper');

        const datesData = [
            {
                id: 1,
                title: 'прибытие',
                type: InputType.DATE,
                name: 'date',
                rules: {date: true},
                onChange: this.getInputHandler('arrivalDate'),
            },
            {
                id: 1,
                title: 'выезд',
                type: InputType.DATE,
                name: 'date',
                rules: {date: true},
                onChange: this.getInputHandler('departureDate'),
            },
        ]

        datesData.forEach((date: any) => {
            const dateInput = new DateInput(date);
            dateInput.init();

            this.datesWrapper.append(dateInput.getRoot());
            this.widgets.push(dateInput);
        });

        this.rootElement.append(this.datesWrapper);
    }

    protected onSubmit(e: Event): void {
        e.preventDefault();

        // return user.getUser(this.values)
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

        this.initDates();
    }

    public getRoot() {
        return this.rootElement;
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