export default class AbstractWidget {
    constructor(params: any) {
    }


    public beforeDOMShow(): void {
        this.addEvents();
    }

    public beforeDOMHide(): void {
        this.removeEvents();
    }

    protected addEvents(): void {

    }

    protected removeEvents(): void {

    }
}