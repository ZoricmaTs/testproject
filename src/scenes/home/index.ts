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

    constructor(params: any) {
        super(params);

        this.initDropdown();
        this.initAuthButton();
        // this.initLogo();
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

    public openAuthScene(): void {
        console.log('openAuthScene')
        return manager.open(Scenes.Authorization, {name: 'authorization', route: 'authorization'});
    }

    public openScene(): void {
        console.log('openScene');
    }

    public initAuthButton(): void {
        this.authButton = new Btn({
            title: 'authorization',
            classes: ['button_fill', 'button_fill__with-icon'],
            action: this.openAuthScene,
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
                    isActive: false,
                    action: () => console.log('111'),
                },
                {
                    title: 'rtyrty',
                    isActive: false,
                    action: () => console.log('222'),
                },
                {
                    title: 'asdasd',
                    isActive: true,
                    action: () => console.log('333'),
                },
            ]
        });

        this.dropdown.init();
        this.getContainer().append(this.dropdown.getRoot());
        this.widgets.push(this.dropdown);
    }

    public initLogo(): void {
        this.logo = new Logo({});

        this.logo.init();
        this.getContainer().append(this.logo.getRoot());
        this.widgets.push(this.logo);
    }
}