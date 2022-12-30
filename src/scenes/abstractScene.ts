export class AbstractScene {
    name: string;
    root: HTMLDivElement;
    private readonly route: string;

    constructor(params: any) {
        this.name = params.name;
        this.route = params.route;

        this.create();
    }

    public getRoute(): string {
        return this.route;
    }

    public beforeDOMHide(): void {

    }

    public beforeDOMShow(): void {
    }

    public afterDOMShow(): void {
    }

    public afterDOMHide(): void {

    }

    public getContainer(): HTMLElement {
        return this.root;
    }

    public create(): void {
        this.root = document.createElement('div');
        this.root.classList.add(`scene-${this.name}`);
    }
}