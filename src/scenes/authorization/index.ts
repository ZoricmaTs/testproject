import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager, operator, user} from '../../index';

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
            onPress: this.onBack,
            type: ButtonType.TEXT,
        });
        this.button.init();
        this.getContainer().append(this.button.getRoot());
        this.widgets.push(this.button);
    }

    public open(): Promise<any> {
        return Promise.all([operator.getOperator(), user.getUser()])
            .then((response) => {
                const operator = response[0];
                const user = response[1];

                this.setOptions({user, operator});

            })
            .catch((err) => console.log('err open AUTHORIZATION', err));
    }
}
