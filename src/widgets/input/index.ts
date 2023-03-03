import AbstractWidget from '../abstractWidget';
import './style.styl';

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password',
    DATE = 'date',
}

export default class Input extends AbstractWidget {
    public static validator: {[key in string]: any}  = {
        email: (value: string): boolean => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(value),
        minLength: (value: any[], length: number): boolean => value.length >= Math.trunc(length),
        maxLength: (value: any[], length: number): boolean => value.length <= Math.trunc(length),
        date:  (value: string): boolean => /\d{2}\.\d{2}\.\d{4}/.test(value),
        required: (value: any): boolean => (
            typeof value === 'object'
                ? Object.keys(value).length > 0 || value instanceof File
                : !['', 'NaN', 'undefined', 'null'].includes(value.toString())
        ),
    }

    public static errors : {[key in string]: any} = {
        email: 'Некорректное значение',
        minLength: (value: number) => `Количество символов не должно быть меньше ${value} значений`,
        maxLength: (value: number) => `Количество символов не должно превышать ${value} значений`,
    }

    public static validateInputs: {[key in InputType]: {[k in keyof ValidityState]?: string}} = {
        [InputType.EMAIL]: {
            'typeMismatch': 'Некорректное значение',
            'tooLong': 'Количество символов не дожно превышать 255 значений'
        },
        [InputType.TEXT]: {
            'typeMismatch': 'Некорректное значение',
            'tooLong': 'Количество символов не дожно превышать 255 значений'
        },
        [InputType.PASSWORD]: {
            'typeMismatch': 'Некорректное значение',
            'tooLong': 'Количество символов не дожно превышать 255 значений',
            'tooShort': 'Количество символов не дожно превышать 4 значений'
        },
        [InputType.DATE]: {
            'typeMismatch': 'Некорректное значение',
        },
    }

    protected input: HTMLInputElement;
    protected type: InputType;
    protected id: string | number;
    protected name: string;
    protected value: string;
    protected rootElement: HTMLDivElement;
    protected placeholder: string;
    protected required: boolean;
    protected onChangeValue: (value: any) => void;
    protected errors: any;
    protected title: string;
    protected titleElement: HTMLDivElement;
    protected rules: any;

    constructor(params: any) {
        super(params);

        this.type = params.type;
        this.id = params.id;
        this.name = params.name;
        this.value = params.value;
        this.title = params.title;
        this.rules = params.rules;

        this.setPlaceholder(params.placeholder);

        this.errors = [];

        this.onChangeValue = params.onChange;

        this.onChange = this.onChange.bind(this);
    }

    protected setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder ? placeholder : undefined;
    }

    protected createInput(): void {
        this.input = document.createElement('input');
        if (this.type === InputType.DATE) {
            this.input.setAttribute('type', 'text');
        } else {
            this.input.setAttribute('type', this.type);
            this.input.setAttribute('value', this.value);
        }

        this.input.setAttribute('id', `${this.id}`);
        this.input.setAttribute('name', this.name);

        if (this.placeholder) {
            this.input.setAttribute('placeholder', this.placeholder);
        }

        this.input.classList.add(`input-${this.type}__input`);
    }

    public getType(): InputType {
        return this.type;
    }

    protected isValid(value: string,  ruleName: string, ruleValue: any): boolean {
        if (ruleName === 'maxLength' || ruleName === 'minLength')  {
            return Input.validator[ruleName](value, ruleValue);
        }

        return Input.validator[ruleName](value);
    }

    protected setErrors(error: any): void {
        if (!this.errors.hasOwnProperty(error)) {
            this.errors = Object.assign(error, this.errors);
        }
    }

    public getErrors(): any {
        return this.errors;
    }

    public hasError(key: string): any {
        return Object.keys(this.errors).includes(key);
    }

    protected onChange(e: Event): void {
        if (this.onChangeValue) {
            const value = (e.target as HTMLInputElement).value;
            if (this.rules) {
                Object.entries(this.rules).map(([ruleName, ruleValue]: [key: string, value: any]) => {
                    let isValid: boolean = this.isValid(value, ruleName, ruleValue)
                    let error: any;


                    if (!isValid) {
                        if (ruleName === 'maxLength' || ruleName === 'minLength') {
                            error = {[ruleName]: Input.errors[ruleName](ruleValue)};
                        } else {
                            error = {[ruleName]: Input.errors[ruleName]};
                        }

                        this.setErrors(error);
                    } else {
                        if (this.hasError(ruleName)) {
                            delete this.errors[ruleName];
                        }
                    }
                });
            }
        }
    }

    protected isErrorExist(value: string): boolean {
        return Boolean(this.errors.find((error: string) => error === value));
    }

    public checkValidity(validity: ValidityState): any {
        Object.entries(Input.validateInputs[this.type]).forEach(([key, value]: [keyof ValidityState, string]) => {
            const isExist = this.isErrorExist(value);
            if (!isExist) {
                if (validity[key]) {
                    this.errors.push(value);
                }
            }
        });
    }

    public init(): void {
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add(`input-${this.type}`);

        if (this.title) {
            this.initTitle();
        }

        this.createInput();
        this.rootElement.append(this.input);
    }

    protected initTitle(): void {
        this.titleElement = document.createElement('div');
        this.titleElement.classList.add(`input-${this.type}__title`);
        this.titleElement.innerText = this.title;
        this.rootElement.append(this.titleElement);
    }

    public getRoot(): HTMLDivElement {
        return this.rootElement;
    }

    protected addEvents():void {
        this.input.addEventListener('input', this.onChange);
    }

    protected removeEvents(): void {
        this.input.removeEventListener('input', this.onChange);
    }
}