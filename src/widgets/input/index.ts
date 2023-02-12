import AbstractWidget from '../abstractWidget';
import './style.styl';

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password',
}

export default class Input extends AbstractWidget {
    public validateInputs: {[key in InputType]: {[k in keyof ValidityState]?: string}} = {
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
        }
    }

    protected input: HTMLInputElement;
    protected type: InputType;
    protected id: string;
    protected name: string;
    protected value: string;
    private rootElement: HTMLDivElement;
    protected placeholder: string;
    protected required: boolean;
    protected onChangeValue: (value: any) => void;
    protected errors: string[];

    constructor(params: any) {
        super(params);

        this.type = params.type;
        this.id = params.id;
        this.name = params.name;
        this.value = params.value;
        this.placeholder = params.placeholder;
        this.required = params.required;
        this.errors = [];
        this.onChangeValue = params.onChange;

        this.onChange = this.onChange.bind(this);
    }

    private createInput(): void {
        this.input = document.createElement('input');
        this.input.setAttribute('type', this.type);
        this.input.setAttribute('id', this.id);
        this.input.setAttribute('name', this.name)
        this.input.setAttribute('value', this.value);

        if (this.placeholder) {
            this.input.setAttribute('placeholder', this.placeholder);
        }

        this.validate();

        this.input.classList.add(`input-${this.type}__input`);
    }

    private validate(): void {
        if (this.required) {
            this.input.required = this.required;
        }

        switch (this.type) {
            case InputType.EMAIL:
            case InputType.TEXT:
                this.input.setAttribute('maxlength', '255');
                break;
            case InputType.PASSWORD:
                this.input.setAttribute('minlength', '4');
                this.input.setAttribute('maxlength', '255');
                break;
        }
    }

    public getType(): InputType {
        return this.type;
    }

    public onChange(e: Event): void {
        if (this.onChangeValue) {
            const value = (e.target as HTMLInputElement).value;
            const valid = (e.target as HTMLInputElement).validity.valid;
            this.onChangeValue(e);
            this.input.setAttribute('value', value);

            if (valid) {
                this.errors = [];
            }
        }
    }

    public getErrors(): string[] {
        return this.errors;
    }

    protected isErrorExist(value: string): boolean {
        return Boolean(this.errors.find((error: string) => error === value));
    }

    public checkValidity(validity: ValidityState): any {
        Object.entries(this.validateInputs[this.type]).forEach(([key, value]: [keyof ValidityState, string]) => {
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
        this.rootElement.classList.add(`input-${this.type}`)
        this.createInput();
        this.rootElement.append(this.input);
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