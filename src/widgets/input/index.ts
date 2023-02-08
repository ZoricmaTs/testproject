import AbstractWidget from '../abstractWidget';
import './style.styl';

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password',
}

export default class Input extends AbstractWidget {

    private input: HTMLInputElement;
    private readonly type: InputType;
    private readonly id: string;
    private readonly name: string;
    private readonly value: string;
    private rootElement: HTMLDivElement;
    private readonly placeholder: string;
    private readonly required: boolean;
    public onChangeValue: (value: any) => void;

    constructor(params: any) {
        super(params);

        this.type = params.type;
        this.id = params.id;
        this.name = params.name;
        this.value = params.value;
        this.placeholder = params.placeholder;
        this.required = params.required;
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

        if (this.type === InputType.PASSWORD) {

        }


        this.input.classList.add(`input-${this.type}__input`);
    }

    private validate(): void {
        if (this.required) {
            this.input.required = this.required;
        }

        switch (this.type) {
            case InputType.EMAIL:
            case InputType.TEXT:
                break;
            case InputType.PASSWORD:
                this.input.setAttribute('minlength', '4');
                break;
        }
    }

    public onChange(e: Event): void {
        if (this.onChangeValue) {
            const value = (e.target as HTMLInputElement).value;
            this.onChangeValue(e);
            this.input.setAttribute('value', value);
        }
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