import {AbstractScene} from '../abstractScene';
import './style.styl';
import Btn from '../../widgets/btn/btn';
import {manager} from '../../index';
import Manager from '../manager';

export default class Home extends AbstractScene {
    constructor(params: any) {
        super(params);

        this.openScene =  this.openScene.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
        this.render();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    public openScene(): void {
        console.log('openScene SCENE_AUTHORIZATION')
        return manager.open(Manager.SCENE_AUTHORIZATION);
    }

    protected render(): any {
        const button = new Btn({title: 'bla', classes: ['home-button'], onClick: this.openScene});
        button.init();

        return this.element.append(button.getRoot());
    }
}