import {AbstractScene} from '../abstractScene';
import './style.styl';
import Btn, {ButtonType} from '../../widgets/btn';
import {manager, operator, user} from '../../index';
import {Scenes} from '../manager';
import Logo from '../../widgets/logo';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';

export default class Home extends AbstractScene {
    private authButton: Btn;
    private logo: Logo;
    protected options: any;
    private user: UserModel;
    private operator: Operator;
    private header: Header;

    constructor(params: any) {
        super(params);

        this.openScene = this.openScene.bind(this);
        this.openAuthScene = this.openAuthScene.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    beforeDOMShow() {
        super.beforeDOMShow();
    }

    public openAuthScene(): Promise<void> {
        return manager.open(Scenes.AUTHORIZATION, {name: 'authorization', route: 'authorization'});
    }

    public openScene(): void {
        console.log('openScene');
    }

    public initAuthButton(): void {
        this.authButton = new Btn({
            title: 'authorization gfdgdfg',
            classes: ['button_fill', 'button_fill__with-icon'],
            onPress: this.openAuthScene,
            type: ButtonType.TEXT_WITH_ICON,
            icon: 'keyboard_arrow_down',
            iconClasses: ['fill-icon']
        });

        this.authButton.init();
        this.getContainer().append(this.authButton.getRoot());
        this.widgets.push(this.authButton);
    }

    private initHeader(): void {
        this.header = new Header({items: this.operator.getHeaderItems(), user: this.user, operator: this.operator});
        this.header.init();
        this.getContainer().append(this.header.getRoot());
        this.widgets.push(this.header);
    }

    private initLogo(): void {
        this.logo = new Logo({});

        this.logo.init();
        this.getContainer().append(this.logo.getRoot());
        this.widgets.push(this.logo);
    }

    protected initWidgets(): void {
        this.initHeader();
        // this.initAuthButton();
        // this.initLogo();
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
            .catch((err) => console.log('err open HOME', err));
    }

    protected setOptions(param: { user: UserModel, operator: Operator }) {
        this.options = param;
    }

    protected getOptions(): any {
        return this.options;
    }
}