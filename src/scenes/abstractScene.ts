import AbstractWidget from '../widgets/abstractWidget';

export class AbstractScene {
    public name: string;
    private root: HTMLDivElement;
    private readonly route: string;
    protected widgets: AbstractWidget[];

    constructor(params: any) {
        this.name = params.name;
        this.route = params.route;
        this.widgets = [];

        this.create();
    }

    public getRoute(): string {
        return this.route;
    }

    public beforeDOMHide(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.beforeDOMHide();
        })
    }

    public beforeDOMShow(): void {
        console.log('scene beforeDOMShow', this.widgets);
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.beforeDOMShow();
        })
    }

    public afterDOMHide(): void {

    }

    public afterDOMShow(): void {

    }

    public getContainer(): HTMLElement {
        return this.root;
    }

    public create(): void {
        this.root = document.createElement('div');
        this.root.classList.add(`scene`);
        this.root.classList.add(`scene-${this.name}`);
    }

    public open(): Promise<any> {
        return;
    }
}