import {AbstractScene} from '../abstractScene';
import './style.styl';
import {manager, operator, user} from '../../index';
import {Scenes} from '../manager';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';
import Checkbox from '../../widgets/checkbox';
import RadioSelector from '../../widgets/radio-selector';

export default class Home extends AbstractScene {
    protected options: any;
    private user: UserModel;
    private operator: Operator;
    private header: Header;
    private checkbox: Checkbox;
    private radioSelector: RadioSelector;

    constructor(params: any) {
        super(params);

        this.openScene = this.openScene.bind(this);
        this.openAuthScene = this.openAuthScene.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.onChangeRadioBtn = this.onChangeRadioBtn.bind(this);
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

    public openAuthScene(): Promise<void> {
        return manager.open(Scenes.AUTHORIZATION, {name: 'authorization', route: 'authorization'});
    }

    public openScene(): void {
        console.log('openScene');
    }

    public onChangeCheck(checked: boolean): void {
        console.log('onChangeCheck', checked);
    }

    public createCheckbox(): Checkbox {
        return new Checkbox({
            id: 'ssdfdsf',
            title: 'dfsdf',
            text: 'text',
            onChange: this.onChangeCheck,
        });
    }

    public initCheckbox(): void {
        this.checkbox = this.createCheckbox();
        this.checkbox.init();

        this.getContainer().append(this.checkbox.getRoot());
        this.widgets.push(this.checkbox);
    }

    public onChangeRadioBtn(id: string): void {
        console.log('id', id);
    }

    public createRadioButton(): RadioSelector {
        return new RadioSelector({
            id: '123',
            title: 'кто ты',
            name: 'sdfsdf',
            onChange: this.onChangeRadioBtn,
            buttons: [
                {
                    id: '111',
                    label: 'мужчина',
                    value: 'мужчина',
                    checked: false,
                },
                {
                    id: '222',
                    label: 'ребёнок',
                    value: 'ребёнок',
                    checked: false,
                },
                {
                    id: '333',
                    label: 'Зус',
                    value: 'Зус',
                    checked: true,
                }
            ]
        });
    }


    public initRadioButton(): void {
        this.radioSelector = this.createRadioButton();
        this.radioSelector.init();

        this.getContainer().append(this.radioSelector.getRoot());
        this.widgets.push(this.radioSelector);
    }

    private initHeader(): void {
        this.header = new Header({items: this.operator.getHeaderItems(), user: this.user, operator: this.operator});
        this.header.init();
        this.getContainer().append(this.header.getRoot());
        this.widgets.push(this.header);
    }

    protected initWidgets(): void {
        this.initHeader();
        this.initCheckbox();
        this.initRadioButton();
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
            .catch((err) => console.log('err open HOME', err));
    }

    protected setOptions(param: { user: UserModel, operator: Operator }) {
        this.options = param;
    }

    protected getOptions(): any {
        return this.options;
    }
}