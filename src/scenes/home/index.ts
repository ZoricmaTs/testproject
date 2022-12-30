import {AbstractScene} from '../abstractScene';
import './style.styl';
import Btn from '../../widgets/btn/btn';
import {manager} from '../../index';
import Manager, {Scenes} from '../manager';

export default class Home extends AbstractScene {
    private button: Btn;
    constructor(params: any) {
        super(params);

        this.initButton();
        this.openScene =  this.openScene.bind(this);
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

    public openScene(): void {
        return manager.open(Scenes.Authorization, {name: 'authorization', route: 'authorization'});
    }

    public initButton(): void {
        this.button = new Btn({title: 'bla', classes: ['home-button'], onClick: this.openScene});
        this.button.init();
        this.getContainer().append(this.button.getRoot());
    }
}