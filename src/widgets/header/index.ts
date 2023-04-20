import AbstractWidget from '../abstractWidget';
import * as Helper from '../../helper';
import './style.styl';
import Dropdown, {DropdownItem} from '../dropdown';
import {SceneParams, Scenes} from '../../scenes/manager';
import {manager, screen} from '../../index';
import Btn, {ButtonType} from '../btn';
import UserModel from '../../models/user';
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
    private isDemo: boolean;
    private logo: Logo;
    private desktopWrapper: HTMLDivElement;

    private headerWrapper: HTMLDivElement;
    private fullHeaderWidth: number;
    private mobileWrapper: HTMLDivElement;
    private desktopElements: (Btn | Dropdown)[];
    private mobileElements: (Btn | Dropdown)[];
    private isContain: boolean;
    private menuButton: Btn;
    private isOpenMenu: boolean;
    private menuIcon: string;
    private authButton: Btn;
    private authMobileButton: Btn;
    private regButton: Btn;
    private regMobileButton: Btn;
    private profileButton: Btn;
    private profileMobileButton: Btn;

    constructor(params: any) {
        super(params);

        this.itemsData = params.items;
        this.isDemo = params.isDemo;
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

        this.update();
    }

    private update(): void {
        const width = this.headerWrapper.getBoundingClientRect().width;
        const widthLogo: number = this.logo.getRoot().getBoundingClientRect().width;

        this.show(this.desktopWrapper);

        this.fullHeaderWidth = this.getDesktopWrapperWidth() + widthLogo;
        this.isContain = width > this.fullHeaderWidth;

        if (this.isContain) {
            this.hide(this.menuButton.getRoot());
        } else {
            this.hide(this.desktopWrapper);
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
        this.isOpenMenu = isOpen;

        if (isOpen) {
            this.menuIcon = 'close';
            this.show(this.mobileWrapper);
        } else {
            this.menuIcon = 'menu';
            this.hide(this.mobileWrapper);
        }

        this.menuButton.setTitle(this.menuIcon);
    }

    private initWrappers(): void {
        this.desktopWrapper = document.createElement('div');
        this.desktopWrapper.classList.add('header__items');
        this.headerWrapper.append(this.desktopWrapper);

        this.mobileWrapper = document.createElement('div');
        this.mobileWrapper.classList.add('header__items-mobile');
        this.getRoot().append(this.mobileWrapper);
    }

    private getDesktopWrapperWidth(): number {
        return this.desktopWrapper.getBoundingClientRect().width;
    }

    public beforeDOMShow() {
        super.beforeDOMShow();
    }

    public beforeDOMHide() {
        super.beforeDOMHide();
    }

    public onPressDropdownItem({nextScene, sceneParams, index, parentId}: any): Promise<void> {
        const currentDropdown = this.getDropdowns().find((dropdown: Dropdown) => dropdown.id === parentId);
        currentDropdown.setActiveIndex(index);

        return manager.open(nextScene, sceneParams).catch(null);
    }

    public openScene(nextScene: Scenes, params: SceneParams): Promise<void> {
        return manager.open(nextScene, params).catch(null);
    }

    private prepareItemsData(): ItemParams[] {
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
                item.styles = ['header__item']
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
            return this.desktopElements.filter((item: Btn | Dropdown) => item instanceof Dropdown) as Dropdown[];
        }

        return this.mobileElements.filter((item: Btn | Dropdown) => item instanceof Dropdown) as Dropdown[];
    }

    private createMenuElements(): any {
        return this.prepareItemsData().map((item) => {
            if (item.type === HeaderType.DROPDOWN) {
                return new Dropdown({
                    id: item.id,
                    buttonTitle: item.title,
                    items: item.items,
                    styles: item.styles,
                });
            }

            const nextScene = manager.getSceneRoute(item.route);
            const button = new Btn({
                title: item.title,
                onPress: () => this.openScene(nextScene, {route: item.route, name: item.route}),
                type: ButtonType.TEXT,
                classes: ['header__button', 'header__item'],
                isActive: item.isActive,
                data: item.data,
            });

            button.init();
            button.setActive(manager.isCurrentScene(item.data));

            return button;

        });
    }

    private initMenuElements(): void {
        this.desktopElements = this.createMenuElements();
        this.mobileElements = this.createMenuElements();
    }

    private createAuthButton(): Btn {
        return new Btn({
            title: 'authorization',
            classes: ['button__stroke', 'header__item'],
            onPress: () => this.openScene(Scenes.AUTHORIZATION, {route: 'authorization', name: 'authorization'}),
            type: ButtonType.TEXT,
        });
    }

    private initAuthButtons(): void {
        if (this.isDemo) {
            this.authButton = this.createAuthButton();
            this.authButton.init();

            this.authMobileButton = this.createAuthButton();
            this.authMobileButton.init();

            this.desktopWrapper.append(this.authButton.getRoot());
            this.widgets.push(this.authButton);
            this.mobileWrapper.append(this.authMobileButton.getRoot());
            this.widgets.push(this.authMobileButton);
        }
    }

    private createRegButton(): Btn {
        return new Btn({
            title: 'registration',
            classes: ['button__fill', 'header__item'],
            onPress: () => this.openScene(Scenes.REGISTRATION, {route: 'registration', name: 'registration'}),
            type: ButtonType.TEXT,
        })
    }

    private createProfileButton(): Btn {
        return new Btn({
            title: this.user.getFirstName(),
            classes: ['header__button', 'header__item'],
            onPress: () => console.log('open Profile'),
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

    private initRegButtons(): void {
        if (this.isDemo) {
            this.regButton = this.createRegButton();
            this.regButton.init();
            this.regMobileButton = this.createRegButton();
            this.regMobileButton.init();

            this.desktopWrapper.append(this.regButton.getRoot());
            this.widgets.push(this.regButton);
            this.mobileWrapper.append(this.regMobileButton.getRoot());
            this.widgets.push(this.regMobileButton);
        }
    }

    private initProfileButton(): void {
        if (!this.isDemo && this.user) {
            this.profileButton = this.createProfileButton();
            this.profileButton.init();
            this.profileButton.getRoot().classList.add('header__button_profile')
            this.desktopWrapper.append(this.profileButton.getRoot());
            this.widgets.push(this.profileButton);

            this.profileMobileButton = this.createProfileButton();
            this.profileMobileButton.init();
            this.mobileWrapper.append(this.profileMobileButton.getRoot());
            this.widgets.push(this.profileMobileButton);
        }
    }

    public setData({user, isDemo}: {user?: UserModel, isDemo?: boolean}): void {
        if (user) {
            this.user = user;
        }

        if (isDemo) {
            this.isDemo = isDemo;
        }
    }

    public getRoot(): any {
        return this.rootElement;
    }

    private onPressMenu(): void {
        this.showHideMenu(!this.isOpenMenu);
    }

    private onBlurMenu(e: Event): void {
        const isNodeContains = this.getRoot().contains(e.target);

        if (!isNodeContains) {
            this.showHideMenu(false);
        }
    }

    private initMobileMenuButton(): void {
        this.menuButton = new Btn({
            title: 'menu',
            classes: ['header__menu-button', 'material-icons', 'icon'],
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
        this.headerWrapper.classList.add('header__wrapper');
        this.rootElement.append(this.headerWrapper);

        this.initLogo();

        this.initWrappers();

        this.initMenuElements();

        this.desktopElements.forEach((item) => {
            this.desktopWrapper.append(item.getRoot());

            this.widgets.push(item);
        });

        this.mobileElements.forEach((item) => {
            this.mobileWrapper.append(item.getRoot());

            this.widgets.push(item);
        });

        this.initAuthButtons();
        this.initRegButtons();
        this.initProfileButton();

        this.initMobileMenuButton();
    }

    private onResize(params: any) {
        this.update();

        this.showHideMenu(false);
    }

    protected addEvents():void {
        super.addEvents();

        screen.on(Screen.EVENT_RESIZE, [this.onResize]);
        window.addEventListener('click',  this.onBlurMenu);
    }

    protected removeEvents() {
        super.removeEvents();

        screen.off(Screen.EVENT_RESIZE, this.onResize);
        window.removeEventListener('click', this.onBlurMenu);
    }
}