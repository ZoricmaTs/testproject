import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';
import Btn, {ButtonType} from '../btn';
import Dropdown, {DropdownItem} from '../dropdown';
import {SceneParams, Scenes} from '../../scenes/manager';
import {manager} from '../../index';

export type HeaderItem = {
    id: number,
    title: string,
    route: string,
    name: string,
    type: HeaderType,
    items?: DropdownItem[],
}

export enum HeaderType {
    SIMPLE = 'simple',
    DROPDOWN = 'dropdown',
}

export default class Header extends AbstractWidget {
    private rootElement: Element;
    private items: HeaderItem[];
    private dropdown: Dropdown;

    constructor(params: any) {
        super(params);

        this.items = params.items;

        this.onPressDropdownItem = this.onPressDropdownItem.bind(this);
        this.openScene = this.openScene.bind(this);
    }

    public beforeDOMShow() {
        super.beforeDOMShow();
    }

    public beforeDOMHide() {
        super.beforeDOMHide();
    }

    public onPressDropdownItem({nextScene, sceneParams, index}: any): Promise<void> {
        this.dropdown.setActiveIndex(index);

        return manager.open(nextScene, sceneParams).catch(null);
    }

    public openScene(nextScene: Scenes, params: SceneParams): Promise<void> {
        return manager.open(nextScene, params).catch(null);
    }

    private getItemsElements(): any[] {
        return this.items.map((item: HeaderItem) => {
            if (item.type === HeaderType.DROPDOWN) {
                const dropdownItems = item.items.map((item: DropdownItem) => {
                    item.isActive = manager.isCurrentScene(item.data);
                    item.onPress = () => this.onPressDropdownItem({
                        nextScene: item.data,
                        sceneParams: {
                            name: item.data,
                            route: item.data
                        },
                        index: item.id
                    });

                    return item;
                })

                this.dropdown = new Dropdown({
                    title: item.title,
                    items: dropdownItems,
                });

                this.widgets.push(this.dropdown);
                this.getRoot().append(this.dropdown.getRoot());
            } else {
                const nextScene = manager.getSceneRoute(item.route);
                const button = new Btn({
                    title: item.title,
                    onPress: () => this.openScene(nextScene, {route: item.route, name: item.route}),
                    type: ButtonType.TEXT,
                    classes: ['header_button'],
                    isActive: manager.isCurrentScene(item.route),
                    data: item.route,
                });

                button.init();
                button.setActive(manager.isCurrentScene(item.route));
                this.widgets.push(button);
                this.getRoot().append(button.getRoot());
            }
        });
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public init(): void {
        const markUp: string = `<header class="header"/>`;

        this.rootElement = Helper.DOM(markUp);
        this.getItemsElements();
    }
}