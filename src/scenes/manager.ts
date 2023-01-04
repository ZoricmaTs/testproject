import {AbstractScene} from './abstractScene';
import Home from './home';
import Authorization from './authorization';
import Company from './company';
import Vacation from './vacation';
import Agreements from './agreements';

export enum Scenes {
    AGREEMENTS ='agreements',
    AUTHORIZATION = 'authorization',
    COMPANY = 'company',
    HOME = 'home',
    SERVICES_BOOKING = 'services-booking',
    SERVICES_BREAKFAST = 'services-breakfast',
    VACATION = 'vacation',
}

export type SceneParams = {
    route: string,
    name: string,
}

export type RouteParam = {
    name: string,
    instance: AbstractScene,
}

export default class Manager {
    private scene: AbstractScene;

    protected getSceneClass(route: Scenes, params: SceneParams): AbstractScene {
        switch (route) {
            case Scenes.COMPANY:
                return new Company(params);
                break;
            case Scenes.SERVICES_BOOKING:
                return new Home(params);
                break;
            case Scenes.SERVICES_BREAKFAST:
                return new Home(params);
                break;
            case Scenes.VACATION:
                return new Vacation(params);
                break;
            case Scenes.AGREEMENTS:
                return new Agreements(params);
            case Scenes.HOME:
                return new Home(params);
            case Scenes.AUTHORIZATION:
                return new Authorization(params);
        }
    }

    private readonly routes: RouteParam[];

    constructor() {
        this.routes = [];
    }

    private hide(scene: AbstractScene): void {
        const sceneContainer: HTMLElement = scene.getContainer();
        sceneContainer.classList.remove('show');
        sceneContainer.classList.add('hide');
    }

    private show(scene: AbstractScene): void {
        const sceneContainer: HTMLElement = scene.getContainer();
        sceneContainer.classList.remove('hide');
        sceneContainer.classList.add('show');
    }

    public open(nextScene: Scenes, params: SceneParams): Promise<void> {
        let prevScene: AbstractScene;

        if (this.scene) {
            prevScene = this.scene;
            this.scene.beforeDOMHide();
            this.hide(this.scene);
        }

        this.scene = this.getSceneClass(nextScene, params);

        return this.scene.open().then((data: any) => {
            this.scene.beforeDOMShow();
            this.show(this.scene);

            document.body.append(this.scene.getContainer());

            this.routes.push({name: this.scene.getRoute(), instance: this.scene});

            if (prevScene) {
                prevScene.afterDOMHide();
            }

            this.scene.afterDOMShow();
        })
    }

    public unmountScene(): void {
        this.scene.getContainer().remove();
    }

    public getCurrentRoute(): RouteParam {
        return this.routes[this.routes.length - 1];
    }

    public goBack(): void {
        this.scene.beforeDOMHide();
        this.hide(this.scene);
        this.scene.afterDOMHide();

        this.routes.pop();
        this.unmountScene();

        const currentRoute: RouteParam = this.getCurrentRoute();

        this.scene = currentRoute.instance;
        this.scene.beforeDOMShow();
        this.show(this.scene);
        this.scene.afterDOMShow();
    }
}