import {AbstractScene} from '../abstractScene';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';
import './style.styl';
import '../scene.styl';
import AuthorizationForm from '../../widgets/form/auth';

export default class Registration extends AbstractScene {
    private header: Header;
    private user: UserModel;
    private operator: Operator;
    private background: HTMLImageElement;
    private contentWrapper: HTMLDivElement;
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
        // this.initFormWidget();
    }
    
    protected getTitle(): string {
        return 'Войти';
    }

    private onAuthorization(): void {
        console.log('dsf')
    }

    private initFormWidget(): void {
        this.formWidget = new AuthorizationForm({title: this.getTitle()});
        this.formWidget.init();
        this.contentWrapper.append(this.formWidget.getRoot());
        this.widgets.push(this.formWidget);
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
