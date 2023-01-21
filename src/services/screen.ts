import EventListener from '../event-listener';

export default class Screen extends EventListener {
    public static EVENT_RESIZE: string = 'resize';
    private width: number;
    private height: number;

    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.onResize = this.onResize.bind(this);

        window.addEventListener('resize', this.onResize);

    }

    private onResize(e: UIEvent) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.fireEvent(Screen.EVENT_RESIZE, {width: this.width, height: this.height});
    }
}