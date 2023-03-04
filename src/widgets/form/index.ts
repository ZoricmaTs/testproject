import AbstractWidget from '../abstractWidget';
import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';
import './style.styl';

export enum FormMethod  {
    GET = 'get',
    POST = 'post',
    DIALOG = 'dialog',
}

export type FormParams = {
    additionalElement?: any
    method?: FormMethod,
    title?: string,
}

export default class AbstractForm extends AbstractWidget {
    protected rootElement: HTMLFormElement;
    protected inputs: Input[];
    protected button: Btn;
    protected method: FormMethod;
    protected title: string;
    protected titleElement: HTMLDivElement;
    protected error: string;
    protected errorElement: HTMLDivElement;

    constructor(params: FormParams) {
        super(params);

        this.method = params.method ? params.method : FormMethod.GET;
        this.title = params.title;

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

    protected checkInputValidate(type: InputType, validityState: ValidityState) {
        const input = this.getInput(type);
        // input.checkValidity(validityState);
        const errors = input.getErrors().join(', ');

        this.setError(errors);
        this.showHideError(true);
    }

    protected getInput(type: InputType): Input {
        return this.inputs.find((input: Input) => input.getType() === type);
    }

    protected showHideError(isError: boolean):void {
        if (isError) {
            this.errorElement.innerText = this.getError();
            this.errorElement.classList.remove('hide');
            this.errorElement.classList.add('show');
        } else {
            this.errorElement.classList.remove('show');
            this.errorElement.classList.add('hide');
        }
    }

    protected setError(message: string): void {
        this.error = message;
    }

    protected getError(): string {
        return this.error;
    }

    protected initErrorMessage(): void {
        this.errorElement = document.createElement('div');
        this.errorElement.classList.add('form__error', 'hide');
        this.rootElement.append(this.errorElement);
    }

    protected initTitle(): void {
        this.titleElement = document.createElement('div');
        this.titleElement.classList.add('form__title');
        this.titleElement.innerText = this.title;
        this.rootElement.append(this.titleElement);
    }

    protected createInputs(): Input[] {
        return [];
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
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');
        this.rootElement.setAttribute('method', this.method);

        if (this.title) {
            this.initTitle();
        }

        this.initInputs();
        // this.initErrorMessage();
        this.initSubmitButton();
    }

    public getRoot() {
        return this.rootElement;
    }

    protected initSubmitButton(): void {
        this.button = new Btn({
            title: 'Войти',
            classes: ['button__fill', 'button__with-icon'],
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