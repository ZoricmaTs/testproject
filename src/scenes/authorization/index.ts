import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';
import './style.styl';
import '../scene.styl';

export default class Authorization extends AbstractScene {
    private button: Index;
    private header: Header;
    private user: UserModel;
    private operator: Operator;
    private background: HTMLImageElement;
    private form: HTMLFormElement;
    private contentWrapper: HTMLDivElement;

    constructor(params: any) {
        super(params);

        this.onBack =  this.onBack.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMShow() {
        super.beforeDOMShow();

        this.initContentWrapper();
        this.initBackground();
        this.initForm();
        this.initTitle();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    protected onBack(): void {
        return manager.goBack();
    }

    public initButton(): void {
        this.button = new Index({
            title: 'back',
            classes: ['back-button'],
            onPress: this.onBack,
            type: ButtonType.TEXT,
        });
        this.button.init();
        this.getContainer().append(this.button.getRoot());
        this.widgets.push(this.button);
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
        // this.initButton();
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
        return Promise.all([operator.getOperator(), user.getUser()])
            .then((response) => {
                const operator = response[0];
                const user = response[1];

                this.setOptions({user, operator});
                const options = this.getOptions();
                this.user = options.user;
                this.operator = options.operator;

                this.initWidgets();
            })
            .catch((err) => console.log('err open AUTHORIZATION', err));
    }


    protected setOptions(param: { user: UserModel, operator: Operator }) {
        this.options = param;
    }

    protected getOptions(): any {
        return this.options;
    }
}
