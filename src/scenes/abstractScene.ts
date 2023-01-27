import AbstractWidget from '../widgets/abstractWidget';

export class AbstractScene {
    public name: string;
    private root: HTMLDivElement;
    private readonly route: string;
    protected widgets: AbstractWidget[];
    protected options: any;

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
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.beforeDOMShow();
        })
    }

    public afterDOMHide(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.afterDOMHide();
        })
    }

    public afterDOMShow(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.afterDOMShow();
        })
    }

    public getContainer(): HTMLElement {
        return this.root;
    }

    public create(): void {
        this.root = document.createElement('div');
        this.root.classList.add(`scene`);
        this.root.classList.add(`scene__${this.name}`);
    }

    public open(): Promise<any> {
        return;
    }

    protected setOptions(param: any) {
        this.options = param;
    }

    protected getOptions(): any {
        return this.options;
    }
}