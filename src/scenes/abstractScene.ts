export class AbstractScene {
    protected name: string;
    element: HTMLDivElement;

    constructor(params: any) {
        this.name = params.name;
        this.init();
    }

    public beforeDOMHide(): void {

    }

    public beforeDOMShow(): void {

    }

    public afterDOMShow(): void {

    }

    public afterDOMHide(): void {

    }

    protected init(): void {
        this.element = document.createElement('div');
        this.element.classList.add(`scene-${this.name}`);
        document.body.append(this.element);
    }

    protected render(): any {
        return;
    }
}