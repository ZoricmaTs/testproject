import AbstractWidget from '../abstractWidget';
import Input, {InputType} from '../input';
import Btn, {ButtonType} from '../btn';

export default class AbstractForm extends AbstractWidget {
    private rootElement: HTMLFormElement;
    private inputs: Input[];
    private button: Btn;
    constructor(params: any) {
        super(params);

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

    private createInputs(): Input[] {
        const inputs: Input[] = [
            new Input({
                id: 'auth_email',
                name: 'email',
                value: '',
                type: InputType.EMAIL,
                placeholder: 'email',
                required: true,
                onChange: () => {},
            }),
            new Input({
                id: 'auth_password',
                name: 'password',
                value: '',
                type: InputType.PASSWORD,
                placeholder: 'password',
                required: true,
                onChange: () => {},
            }),
        ];

        return inputs;
    }

    private initInputs(): void {
        this.inputs = this.createInputs();

        this.inputs.forEach((input: Input) => {
            input.init();
            this.rootElement.append(input.getRoot());
            this.widgets.push(input);
        });
    }

    protected onSubmit(e: Event): void {
        console.log('onSubmit', e.target);
    }

    public init(): void {
        this.rootElement = document.createElement('form');
        this.rootElement.classList.add('form');
        this.rootElement.setAttribute('method', 'post');

        this.initInputs();
        this.initSubmitButton();
    }

    public getRoot() {
        return this.rootElement;
    }

    protected initSubmitButton(): void {
        this.button = new Btn({
            title: 'Войти',
            classes: ['button__fill', 'button__with-icon'],
            onPress: () => {},
            type: ButtonType.TEXT_WITH_ICON,
            icon: 'arrow_forward',
            iconClasses: ['button__fill-icon']
        });

        this.button.init();
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