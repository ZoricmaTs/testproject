import {AbstractScene} from '../abstractScene';
import './style.styl';
import Btn, {ButtonType} from '../../widgets/btn';
import {manager} from '../../index';
import {Scenes} from '../manager';
import Logo from '../../widgets/logo';
import Dropdown from '../../widgets/dropdown';

export default class Home extends AbstractScene {
    private dropdown: Dropdown;
    private authButton: Btn;
    private logo: Logo;
    private activeButtonIndex: number;

    constructor(params: any) {
        super(params);

        this.activeButtonIndex = 2;

        this.openScene = this.openScene.bind(this);
        this.openAuthScene = this.openAuthScene.bind(this);
        this.onPressDropdownItem = this.onPressDropdownItem.bind(this);

        this.initDropdown();
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
        super.beforeDOMShow();
    }

    public openAuthScene(): void {
        return manager.open(Scenes.Authorization, {name: 'authorization', route: 'authorization'});
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

    public onPressDropdownItem(data: number):void {
        this.activeButtonIndex = data;
        this.dropdown.setActiveIndex(data);
    }

    public initLogo(): void {
        this.logo = new Logo({});

        this.logo.init();
        this.getContainer().append(this.logo.getRoot());
        this.widgets.push(this.logo);
    }
}