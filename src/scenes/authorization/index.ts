import {AbstractScene} from '../abstractScene';
import Btn from '../../widgets/btn/btn';
import {manager} from '../../index';

export default class Authorization extends AbstractScene {
    constructor(params: any) {
        super(params);

        // this.render();

        this.onBack =  this.onBack.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
        this.render();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    public onBack(): void {
        return manager.onBack()
        console.log('onBack')
    }


    protected render(): any {
        const backButton = new Btn({title: 'back', classes: [], onClick: this.onBack});
        backButton.init();

        return this.element.append(backButton.getRoot());
    }
}
