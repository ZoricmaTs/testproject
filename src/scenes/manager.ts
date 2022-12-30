import {AbstractScene} from './abstractScene';
import Home from './home';
import Authorization from './authorization';


export default class Manager {
    private scene: any;

    public static SCENE_HOME = new Home({name: 'home'});
    public static SCENE_AUTHORIZATION = new Authorization({name: 'authorization'});

    constructor() {
    }



    private hide(scene: AbstractScene): void {
        scene.element.classList.remove('show');
        scene.element.classList.add('hide');
    }

    private show(scene: AbstractScene): void {
        scene.element.classList.remove('hide');
        scene.element.classList.add('show');
    }

    public open(nextScene: AbstractScene): void {
        let prevScene;

        if (this.scene) {
            prevScene = this.scene;
            this.scene.beforeDOMHide();
            this.hide(this.scene);
        }

        nextScene.beforeDOMShow();

        this.scene = nextScene;
        this.show(this.scene);

        if (prevScene) {
            prevScene.afterDOMHide();
        }

        this.scene.afterDOMShow();
    }

    public onBack(): void {

    }
}