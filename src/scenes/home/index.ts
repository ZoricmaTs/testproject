import {AbstractScene} from '../abstractScene';
import './style.styl';
import Btn, {ButtonType} from '../../widgets/btn';
import {manager, operator, user} from '../../index';
import {Scenes} from '../manager';
import Logo from '../../widgets/logo';
import Dropdown from '../../widgets/dropdown';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';

export default class Home extends AbstractScene {
    private dropdown: Dropdown;
    private authButton: Btn;
    private logo: Logo;
    private activeButtonIndex: number;
    private options: { user: any };
    private user: UserModel;
    private operator: Operator;
    private header: Header;

    constructor(params: any) {
        super(params);

        this.activeButtonIndex = 2;

        this.openScene = this.openScene.bind(this);
        this.openAuthScene = this.openAuthScene.bind(this);
        this.onPressDropdownItem = this.onPressDropdownItem.bind(this);

        // this.initDropdown();
        // this.initAuthButton();
        // this.initLogo();


    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    beforeDOMShow() {
        const {user, operator} = this.getOptions();
        this.user = user;
        this.operator = operator;
        this.initHeader();

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

    public initDropdown(): void {
        this.dropdown = new Dropdown({
            title: 'Услуги',
            items: [
                {
                    title: 'qweqwe',
                    isActive: this.activeButtonIndex === 0,
                    data: 0,
                    onPress: this.onPressDropdownItem,
                },
                {
                    title: 'rtyrty',
                    isActive: this.activeButtonIndex === 1,
                    data: 1,
                    onPress: this.onPressDropdownItem,
                },
                {
                    title: 'asdasd',
                    isActive: this.activeButtonIndex === 2,
                    data: 2,
                    onPress: this.onPressDropdownItem,
                },
            ]
        });

        this.dropdown.init();
        this.getContainer().append(this.dropdown.getRoot());
        this.widgets.push(this.dropdown);
    }

    private onPressDropdownItem(data: number):void {
        this.activeButtonIndex = data;
        this.dropdown.setActiveIndex(data);
    }

    private initHeader(): void {
        this.header = new Header({items: this.operator.getHeaderItems()});
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

    public open(): Promise<any> {
        return Promise.all([operator.getOperator(), user.getUser()])
            .then((response) => {
                const operator = response[0];
                const user = response[1];

                this.setOptions({user, operator});
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