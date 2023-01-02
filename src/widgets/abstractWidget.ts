export default class AbstractWidget {
    protected widgets: AbstractWidget[];

    constructor(params: any) {
        this.widgets = [];
    }


    public beforeDOMShow(): void {
        this.widgets.forEach((widget: AbstractWidget) => {
            widget.beforeDOMShow();
        });

        this.addEvents();
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