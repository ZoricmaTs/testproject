import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';
import './style.styl';
import '../scene.styl';
import Input, {InputType} from '../../widgets/input';
import Btn from '../../widgets/btn';
import AuthorizationForm from '../../widgets/form/auth';
import {FormMethod} from '../../widgets/form';

export default class Authorization extends AbstractScene {
    private button: Index;
    private header: Header;
    private user: UserModel;
    private operator: Operator;
    private background: HTMLImageElement;
    private form: HTMLFormElement;
    private contentWrapper: HTMLDivElement;
    private inputs: Input[];
    private authButton: Btn;
    private regButton: Btn;
    private formWidget: AuthorizationForm;

    constructor(params: any) {
        super(params);

        this.onBack =  this.onBack.bind(this);
        this.onAuthorization = this.onAuthorization.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMShow() {
        super.beforeDOMShow();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    protected onBack(): void {
        return manager.goBack();
    }

    protected initHeader(): void {
        this.header = new Header({items: this.operator.getHeaderItems(), user: this.user, operator: this.operator});
        this.header.init();
        this.getContainer().append(this.header.getRoot());
        this.widgets.push(this.header);
    }

    protected initBackground(): void {
        this.background = document.createElement('img');
        this.background.classList.add('scene__background');
        this.background.src = require('./background.png');
        this.contentWrapper.append(this.background);
    }

    protected initWidgets(): void {
        this.initHeader();
        this.initContentWrapper();
        this.initBackground();
        this.initFormWidget();
        // this.initForm();
        // this.initTitle();
        // this.initInputs();
        // this.initAuthButton();
        // this.initRegButton();
    }
    
    protected getTitle(): string {
        return 'Войти';
    }
    
    protected initTitle(): void {
        const title = document.createElement('div');
        title.classList.add(`scene__${this.name}_title`, 'scene__title');
        title.innerText = this.getTitle();
        this.form.append(title);
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

    private onAuthorization(): void {
        console.log('dsf')
    }

    private initAuthButton(): void {
        this.authButton = new Btn({
            title: 'Войти',
            classes: ['button__fill', 'button__with-icon', `scene__${this.name}_form_auth-button`],
            onPress: this.onAuthorization,
            type: ButtonType.TEXT_WITH_ICON,
            icon: 'arrow_forward',
            iconClasses: ['button__fill-icon']
        });

        this.authButton.init();
        this.authButton.getRoot().setAttribute('type', 'submit');
        this.form.append(this.authButton.getRoot());
        this.widgets.push(this.authButton);
    }

    private initRegButton(): void {
        this.regButton = new Btn({
            title: 'создать',
            classes: ['button__stroke'],
            onPress: this.onBack,
            type: ButtonType.TEXT,
        });
        this.regButton.init();

        const wrapper = document.createElement('div');
        wrapper.classList.add(`scene__${this.name}_form_button-wrapper`);

        const text = document.createElement('p');
        text.classList.add(`scene__${this.name}_form_button-wrapper-text`);
        text.innerText = 'Нет аккаунта на Toxin?';

        wrapper.append(text);
        wrapper.append(this.regButton.getRoot());

        this.form.append(wrapper);
        this.widgets.push(this.regButton);
    }

    private initInputs(): void {
        this.inputs = this.createInputs();

        this.inputs.forEach((input: Input) => {
            input.init();
            this.form.append(input.getRoot());
            this.widgets.push(input);
        });
    }

    private initFormWidget(): void {
        this.formWidget = new AuthorizationForm({title: 'Войти'});
        this.formWidget.init();
        this.contentWrapper.append(this.formWidget.getRoot());
        this.widgets.push(this.formWidget);
    }

    private initForm(): void {
        this.form = document.createElement('form');
        this.form.classList.add(`scene__${this.name}_form`);
        this.contentWrapper.append(this.form);
    }

    private initContentWrapper(): void {
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.classList.add(`scene__${this.name}_content-wrapper`);
        this.getContainer().append(this.contentWrapper);
    }

    public open(): Promise<any> {
        return operator.getOperator()
            .then((response: Operator) => {
                this.operator = response;
                this.setOptions({operator: this.operator});
                this.initWidgets();

                if (!response.isDemo) {
                    return user.getUser()
                        .then((response: UserModel) => {
                            this.user = response;
                        })
                        .catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
                }
            })
            .catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
    }


    protected setOptions(param: { user?: UserModel, operator?: Operator }) {
        if (this.options) {
            Object.assign(this.options, param);
        } else {
            this.options = param;
        }
    }

    protected getOptions(): any {
        return this.options;
    }
}
