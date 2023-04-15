import {AbstractScene} from '../abstractScene';
import './style.styl';
import '../scene.styl';
import {manager, operator, user} from '../../index';
import {Scenes} from '../manager';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';
import Checkbox from '../../widgets/checkbox';
import Slider from '../../widgets/slider';

export default class Home extends AbstractScene {
    protected options: any;
    private user: UserModel;
    private operator: Operator;
    private header: Header;
    private checkbox: Checkbox;
    private background: HTMLImageElement;
    private slider: Slider;

    constructor(params: any) {
        super(params);

        this.openScene = this.openScene.bind(this);
        this.openAuthScene = this.openAuthScene.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    beforeDOMShow() {
        super.beforeDOMShow();

        this.initBackground();
    }

    private initBackground(): void {
        this.background = document.createElement('img');
        this.background.classList.add('scene__background');
        this.background.src = require('./background.png');
        this.getContainer().append(this.background);
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

    public onChangeText(value: string): void {

    }

    private initHeader(): void {
        this.header = new Header({items: this.operator.getHeaderItems(), user: this.user, isDemo: this.operator.isDemo});
        this.header.init();
        this.getContainer().append(this.header.getRoot());
        this.widgets.push(this.header);
    }

    private initSlider(): void {
        this.slider = new Slider({});
        this.slider.init();
        this.getContainer().append(this.slider.getRoot());
        this.widgets.push(this.slider);
    }

    protected initWidgets(): void {
        this.initHeader();
        this.initSlider();
    }

    public open(): Promise<any> {
        return operator.getOperator()
            .then((response: Operator) => {
                this.operator = response;
                this.setOptions({operator: this.operator});
            })
            .then(() => {
                if (!this.operator.isDemo) {
                    return user.getUser()
                        .then((response: UserModel) => {
                            this.user = response;
                            this.setOptions({user: this.user});
                        });
                }
            })
            .then(() => {
                this.initWidgets();
                if (!this.operator.isDemo && this.user) {
                    this.header.setData({user: this.user, isDemo: this.operator.isDemo});
                }
            })
            .catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
    }

    protected setOptions(param: { user?: UserModel, operator?: Operator }) {
        if (this.options) {
            Object.assign(this.options, param);
        } else {
            this.options = param;
        }
    }

    protected getOptions(): any {
        return this.options;
    }
}