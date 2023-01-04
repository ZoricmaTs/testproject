import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';
import Btn, {ButtonType} from '../btn';
import Dropdown from '../dropdown';
import {SceneParams, Scenes} from '../../scenes/manager';


export type HeaderItem = {
    title: string,
    action: () => void,
    dropdownItems?: []
}

export enum HeaderItems {
    BUTTON,
    DROPDOWN,
}

export default class Header extends AbstractWidget {
    private rootElement: Element;
    private items: any[];

    constructor(params: any) {
        super(params);

        this.onPressDropdownToggle = this.onPressDropdownToggle.bind(this);
        this.onPressDropdownItem = this.onPressDropdownItem.bind(this);
        this.openScene = this.openScene.bind(this);
        this.items = this.initItems(params.items);
    }

    public beforeDOMShow() {
        super.beforeDOMShow();
    }

    public beforeDOMHide() {
        super.beforeDOMHide();
    }

    public onPressDropdownToggle(): void {
        console.log('onPressDropdownToggle')
    }

    public onPressDropdownItem(): void {

    }

    public openScene(nextScene: Scenes, params: SceneParams): void {
        return console.log('nextScene', nextScene);
        // return manager.open(nextScene, params);
    }

    public initItems(items: any): any {
        return items.map((item: any) => {
            if (item.items) {
                item.items.map((dropdownItem: any) => {
                    dropdownItem.isActive = false;
                    dropdownItem.data = dropdownItem.id;
                    dropdownItem.onPress = this.onPressDropdownItem
                })

                return item;
            } else {
                // item.onPress = this.openScene(item.route, {route: item.route, name: item.route})
                item.onPress = () => console.log('open scene button');
                return item;
            }
        });
    }

    private getItemsElements(): any[] {
        return this.items.map((item) => {
            if (item.items) {
                const dropdown = new Dropdown({
                    title: item.title,
                    items: item.items,
                    onPress: this.onPressDropdownToggle,
                });

                dropdown.init();
                this.widgets.push(dropdown);
                this.getRoot().append(dropdown.getRoot());

            } else {
                const button = new Btn({
                    title: item.title,
                    onPress: item.onPress,
                    type: ButtonType.TEXT,
                    classes: ['header_button']
                });

                button.init();
                this.widgets.push(button);
                this.getRoot().append(button.getRoot());
            }
        });
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public init(): void {
        const markUp: string = `<header class="header"></header>`;

        this.rootElement = Helper.DOM(markUp);
        this.getItemsElements();
    }

    protected addEvents():void {
        super.addEvents();
    }

    protected removeEvents(): void {
        super.removeEvents();
    }
}