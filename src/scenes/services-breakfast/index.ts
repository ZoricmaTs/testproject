import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';

export default class ServicesBreakfast extends AbstractScene {
    private button: Index;
    constructor(params: any) {
        super(params);

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
            onPress: this.onBack,
            type: ButtonType.TEXT,
        });
        this.button.init();
        this.getContainer().append(this.button.getRoot());
        this.widgets.push(this.button);
    }

    protected initWidgets(): void {
        super.initWidgets();

        this.initButton();
    }

    protected setOptions(param: { user: UserModel, operator: Operator }) {
        this.options = param;
    }

    protected getOptions(): any {
        return this.options;
    }
}
