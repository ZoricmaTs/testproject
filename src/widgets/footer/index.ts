import AbstractWidget from '../abstractWidget';
import './style.styl';

export default class Footer extends AbstractWidget {
    private rootElement: HTMLElement;
    private itemsData: any;


    constructor(params: any) {
        super(params);
        
        this.itemsData = params.items;
    }

    public beforeDOMShow() {
        super.beforeDOMShow();
    }

    public getRoot(): any {
        return this.rootElement;
    }

    public init(): void {
        this.rootElement = document.createElement('footer');
        this.rootElement.classList.add('footer');
    }

    protected addEvents():void {
        super.addEvents();
    }

    protected removeEvents(): void {
        super.removeEvents();
    }

}