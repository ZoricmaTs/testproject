import {AbstractScene} from '../abstractScene';
import './style.styl';
import Btn, {ButtonType} from '../../widgets/btn';
import {manager} from '../../index';
import {Scenes} from '../manager';

export default class Home extends AbstractScene {
    private button: Btn;
    private authButton: Btn;

    constructor(params: any) {
        super(params);

        this.initButton();
        this.initAuthButton();
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
            classes: ['button_fill'],
            onClick: this.openAuthScene,
            type: ButtonType.TEXT,
        });

        this.authButton.init();
        this.getContainer().append(this.authButton.getRoot());
        this.widgets.push(this.authButton);
    }

    public initButton(): void {
        this.button = new Btn({
            title: 'войти',
            classes: ['button_fill'],
            onClick: this.openScene,
            type: ButtonType.TEXT,
        });

        this.button.init();
        this.getContainer().append(this.button.getRoot());
        this.widgets.push(this.button);
    }
}