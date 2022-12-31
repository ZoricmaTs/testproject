import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager} from '../../index';

export default class Authorization extends AbstractScene {
    private button: Index;
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
        this.button = new Index({
            title: 'back',
            classes: ['back-button'],
            onClick: this.onBack,
            type: ButtonType.TEXT,
        });
        this.button.init();
        this.getContainer().append(this.button.getRoot());
    }
}
