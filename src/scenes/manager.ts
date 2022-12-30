import {AbstractScene} from './abstractScene';
import Home from './home';
import Authorization from './authorization';

export enum Scenes {
    Home,
    Authorization,
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
            case Scenes.Home:
                return new Home(params);
            case Scenes.Authorization:
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

    public open(nextScene: Scenes, params: SceneParams): void {
        let prevScene;

        if (this.scene) {
            prevScene = this.scene;
            this.scene.beforeDOMHide();
            this.hide(this.scene);
        }

        const scene = this.getSceneClass(nextScene, params);

        scene.beforeDOMShow();

        this.scene = scene;
        this.show(this.scene);

        document.body.append(this.scene.getContainer());

        this.routes.push({name: this.scene.getRoute(), instance: this.scene});

        if (prevScene) {
            prevScene.afterDOMHide();
        }

        this.scene.afterDOMShow();
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