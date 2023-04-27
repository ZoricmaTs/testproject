import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager, operator, user} from '../../index';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';

export default class Company extends AbstractScene {
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

    public open(): Promise<any> {
        return Promise.all([operator.getOperator(), user.getUser()])
            .then((response) => {
                const operator = response[0];
                const user = response[1];

                this.setOptions({user, operator});

                const options = this.getOptions();
                this.user = options.user;
                this.operator = options.operator;

                this.initWidgets();
            })
            .catch((err) => console.log('err open COMPANY', err));
    }

    protected setOptions(param: { user: UserModel, operator: Operator }) {
        this.options = param;
    }

    protected getOptions(): any {
        return this.options;
    }
}
