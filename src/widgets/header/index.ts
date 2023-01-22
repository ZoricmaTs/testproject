import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';
import Dropdown, {DropdownItem} from '../dropdown';
import {SceneParams, Scenes} from '../../scenes/manager';
import {manager, screen} from '../../index';
import Btn, {ButtonType} from '../btn';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Logo from '../logo';
import Screen from '../../services/screen';

export type ItemParams = {
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
    private itemsData: ItemParams[];
    private user: UserModel;
    private operator: Operator;
    private logo: Logo;
    private itemsElement: HTMLDivElement;

    private headerWrapper: HTMLDivElement;
    private fullHeaderWidth: number;
    private mobileWrapper: HTMLDivElement;
    private itemsElements: (Btn | Dropdown)[];
    private itemsMobileElements: (Btn | Dropdown)[];
    private isContain: boolean;
    private menuButton: Btn;
    private isOpenMenu: boolean;
    private menuIcon: string;

    constructor(params: any) {
        super(params);

        this.itemsData = params.items;
        this.operator = params.operator;
        this.user = params.user;

        this.onPressMenu = this.onPressMenu.bind(this);
        this.onBlurMenu = this.onBlurMenu.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onPressDropdownItem = this.onPressDropdownItem.bind(this);
        this.openScene = this.openScene.bind(this);
    }

    public afterDOMShow() {
        super.afterDOMShow();

        this.isOpenMenu = false;
        this.hide(this.mobileWrapper);

        const widthRootElement = this.rootElement.getBoundingClientRect().width;
        this.update(widthRootElement);
    }

    public afterDOMHide() {
        super.afterDOMHide();

        this.show(this.itemsElement);
    }

    private update(width: number): void {
        const widthLogo: number = this.logo.getRoot().getBoundingClientRect().width;
        this.show(this.itemsElement);
        this.fullHeaderWidth = this.getItemsElementWidth() + widthLogo;
        this.isContain = width > this.fullHeaderWidth;

        if (this.isContain) {
            this.hide(this.menuButton.getRoot());
        } else {
            this.hide(this.itemsElement);
            this.show(this.menuButton.getRoot());
            this.mobileWrapper.style.top = `${this.rootElement.getBoundingClientRect().height}px`;
        }
    }

    private show(element: HTMLElement): void {
        element.classList.add('show');
        element.classList.remove('hide');
    }

    private hide(element: HTMLElement): void {
        element.classList.add('hide');
        element.classList.remove('show');
    }

    private showHideMenu(isOpen: boolean): void {
        if (isOpen) {
            this.menuIcon = 'close';
            this.show(this.mobileWrapper);
        } else {
            this.menuIcon = 'menu';
            this.hide(this.mobileWrapper);
        }

        this.menuButton.setTitle(this.menuIcon);
    }

    private initItemsElement(): void {
        this.itemsElement = document.createElement('div');
        this.itemsElement.classList.add('header_items');
        this.headerWrapper.append(this.itemsElement);

        this.mobileWrapper = document.createElement('div');
        this.mobileWrapper.classList.add('header_items-mobile');
        this.getRoot().append(this.mobileWrapper);
    }

    private getItemsElementWidth(): number {
        return this.itemsElement.getBoundingClientRect().width;
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

    private getItems(): ItemParams[] {
        return this.itemsData.map((item: ItemParams) => {
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
        if (this.isContain) {
            return this.itemsElements.filter((item: Btn | Dropdown) => item instanceof Dropdown) as Dropdown[];
        }

        return this.itemsMobileElements.filter((item: Btn | Dropdown) => item instanceof Dropdown) as Dropdown[];
    }

    private getItemsElements(): any {
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

    private initItems(): void {
        this.itemsElements = this.getItemsElements().map((item: Btn | Dropdown) => {
            if (!(item instanceof Dropdown)) {
                item.init();
                item.setActive(manager.isCurrentScene(item.data));
            }

            return item;
        });

        this.itemsMobileElements = this.getItemsElements().map((item: Btn | Dropdown) => {
            if (!(item instanceof Dropdown)) {
                item.init();
                item.setActive(manager.isCurrentScene(item.data));
            }

            return item;
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

    private initLogo(): void {
        this.logo = new Logo({});

        this.logo.init();
        this.logo.getRoot().classList.add('logo_header-position')
        this.headerWrapper.append(this.logo.getRoot());
        this.widgets.push(this.logo);
    }

    private initAuthBtns(): void {
        if (this.operator.isDemo()) {
            const authBtn = this.getAuthBtn();
            authBtn.init();

            this.itemsElement.append(authBtn.getRoot());
            this.widgets.push(authBtn);

            const registrationBtn = this.getRegistrationBtn();
            registrationBtn.init();

            this.itemsElement.append(registrationBtn.getRoot());
            this.widgets.push(registrationBtn);
        }
    }

    public getRoot(): any {
        return this.rootElement;
    }

    private onPressMenu(): void {
        this.isOpenMenu = !this.isOpenMenu;
        this.showHideMenu(this.isOpenMenu);
    }

    private onBlurMenu(): void {
        if (this.isOpenMenu) {
            this.isOpenMenu = false;
            this.showHideMenu(this.isOpenMenu);
        }
    }

    private initMobileMenuButton(): void {
        this.menuButton = new Btn({
            title: 'menu',
            classes: ['header_menu-button', 'material-icons', 'icon'],
            onPress: () => this.onPressMenu(),
            type: ButtonType.TEXT,
        });

        this.menuButton.init();
        this.headerWrapper.append(this.menuButton.getRoot());

        this.widgets.push(this.menuButton);
    }

    public init(): void {
        const markUp: string = `<header class="header"/>`;
        this.rootElement = Helper.DOM(markUp);
        this.headerWrapper = document.createElement('div');
        this.headerWrapper.classList.add('header_wrapper');
        this.rootElement.append(this.headerWrapper);

        this.initLogo();

        this.initItemsElement();

        this.initItems();

        this.itemsElements.forEach((item) => {
            this.itemsElement.append(item.getRoot());

            this.widgets.push(item);
        });

        this.itemsMobileElements.forEach((item) => {
            this.mobileWrapper.append(item.getRoot());

            this.widgets.push(item);
        });

        this.initMobileMenuButton();
        // this.initAuthBtns();
    }

    private onResize(params: any) {
        this.update(params.width);
    }

    protected addEvents():void {
        super.addEvents();

        screen.on(Screen.EVENT_RESIZE, [this.onResize]);
        window.addEventListener('click',  (e) => {
            const isNodeContains = this.getRoot().contains(e.target);

            if (!isNodeContains) {
                this.isOpenMenu = false;
                this.showHideMenu(this.isOpenMenu);
            }
        });
    }

    protected removeEvents() {
        super.removeEvents();

        screen.off(Screen.EVENT_RESIZE, this.onResize);
    }
}