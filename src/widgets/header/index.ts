import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';
import Dropdown, {DropdownItem} from '../dropdown';
import {SceneParams, Scenes} from '../../scenes/manager';
import {manager} from '../../index';
import Btn, {ButtonType} from '../btn';
import UserModel from '../../models/user';
import Operator from '../../models/operator';

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
    styles?: string[],
}

export enum HeaderType {
    SIMPLE = 'simple',
    DROPDOWN = 'dropdown',
}

export default class Header extends AbstractWidget {
    private rootElement: Element;
    private items: HeaderItem[];
    private user: UserModel;
    private operator: Operator;
    private authBtn: Btn;

    constructor(params: any) {
        super(params);

        this.items = params.items;
        this.operator = params.operator;
        this.user = params.user;

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
        const currentDropdown = this.getDropdowns().find((item: Dropdown) => item.id === parentId);
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
                item.styles = ['header_item']
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
                    items: item.items,
                    styles: item.styles,
                });
            }

            const nextScene = manager.getSceneRoute(item.route);
            return new Btn({
                title: item.title,
                onPress: () => this.openScene(nextScene, {route: item.route, name: item.route}),
                type: ButtonType.TEXT,
                classes: ['header_button', 'header_item'],
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

    private getAuthBtn(): Btn {
        return new Btn({
            title: 'authorization',
            classes: ['button_stroke', 'header_item'],
            onPress: () => this.openScene(Scenes.AUTHORIZATION, {route: 'authorization', name: 'authorization'}),
            type: ButtonType.TEXT,
        })
    }

    private getRegistrationBtn(): Btn {
        return new Btn({
            title: 'registration',
            classes: ['button_fill', 'header_item'],
            onPress: () => this.openScene(Scenes.AUTHORIZATION, {route: 'authorization', name: 'authorization'}),
            type: ButtonType.TEXT,
        })
    }

    private initAuthBtns(): void {
        if (this.operator.isDemo()) {
            const authBtn = this.getAuthBtn();
            authBtn.init();

            this.getRoot().append(authBtn.getRoot());
            this.widgets.push(authBtn);

            const registrationBtn = this.getRegistrationBtn();
            registrationBtn.init();

            this.getRoot().append(registrationBtn.getRoot());
            this.widgets.push(registrationBtn);
        }
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public init(): void {
        const markUp: string = `<header class="header"/>`;
        this.rootElement = Helper.DOM(markUp);

        this.initItemsElements();
        this.initAuthBtns();
    }
}