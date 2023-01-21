export default class AbstractWidget {
    protected widgets: AbstractWidget[];

    constructor(params: any) {
        this.widgets = [];
    }

    protected initWidgets(): void {

    }

    public beforeDOMShow(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.beforeDOMShow();
        });

        this.addEvents();
    }

    public afterDOMShow(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.afterDOMShow();
        });
    }

    public afterDOMHide(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.afterDOMHide();
        });
    }

    public beforeDOMHide(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.beforeDOMHide();
        });

        this.removeEvents();
    }

    protected addEvents(): void {

    }

    protected removeEvents(): void {

    }
}