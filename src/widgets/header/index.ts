import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';
import Dropdown, {DropdownItem} from '../dropdown';
import {SceneParams, Scenes} from '../../scenes/manager';
import {manager} from '../../index';
import Btn, {ButtonType} from '../btn';

export type HeaderItem = {
    isActive: boolean;
    data: string;
    onPress: () => Promise<void>;
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

    public onPressDropdownItem({nextScene, sceneParams, index, parentId}: any): Promise<void> {
        const currentDropdown = this.getDropdowns().find((item: Dropdown) => {
            return item.id === parentId
        });
        console.log('this.currentDropdown', currentDropdown);
        currentDropdown.setActiveIndex(index, parentId);

        return manager.open(nextScene, sceneParams).catch(null);
    }

    public openScene(nextScene: Scenes, params: SceneParams): Promise<void> {
        return manager.open(nextScene, params).catch(null);
    }

    private getItems(): HeaderItem[] {
        return this.items.map((item: HeaderItem) => {
            if (item.type === HeaderType.DROPDOWN) {
                item.items.map((dropdownItem: DropdownItem) => {
                    dropdownItem.isActive = manager.isCurrentScene(dropdownItem.data);
                    dropdownItem.onPress = () => this.onPressDropdownItem({
                        nextScene: dropdownItem.data,
                        sceneParams: {
                            name: dropdownItem.data,
                            route: dropdownItem.data
                        },
                        index: dropdownItem.id,
                        parentId: item.id,
                    });
                })
            } else {
                const nextScene = manager.getSceneRoute(item.route);
                item.isActive = manager.isCurrentScene(item.route);
                item.onPress = () => this.openScene(nextScene, {route: item.route, name: item.route});
                item.data = item.route;
            }

            return item;
        });
    }

    private getDropdowns(): Dropdown[] {
        return this.getItemsElement().filter((item: Btn | Dropdown) => item instanceof Dropdown);
    }

    private getItemsElement(): any {
        return this.getItems().map((item) => {
            if (item.type === HeaderType.DROPDOWN) {
                return new Dropdown({
                    id: item.id,
                    title: item.title,
                    items: item.items
                });
            }

            const nextScene = manager.getSceneRoute(item.route);
            return new Btn({
                title: item.title,
                onPress: () => this.openScene(nextScene, {route: item.route, name: item.route}),
                type: ButtonType.TEXT,
                classes: ['header_button'],
                isActive: item.isActive,
                data: item.data,
            })
        });
    }

    private initItemsElements(): void {
        this.getItemsElement().map((item: Btn | Dropdown) => {
            if (!(item instanceof Dropdown)) {
                item.init();
                item.setActive(manager.isCurrentScene(item.data));
            }

            this.getRoot().append(item.getRoot());
            this.widgets.push(item);
        })
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public init(): void {
        const markUp: string = `<header class="header"/>`;

        this.rootElement = Helper.DOM(markUp);

        this.initItemsElements();
    }
}