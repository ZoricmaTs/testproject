import {AbstractScene} from '../abstractScene';
import Btn from '../../widgets/btn/btn';
import {manager} from '../../index';

export default class Authorization extends AbstractScene {
    private button: Btn;
    constructor(params: any) {
        super(params);

        this.initButton();
        this.onBack =  this.onBack.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    public onBack(): void {
        return manager.goBack();
    }

    public initButton(): void {
        this.button = new Btn({title: 'back', classes: ['back-button'], onClick: this.onBack});
        this.button.init();
        this.getContainer().append(this.button.getRoot());
    }
}
