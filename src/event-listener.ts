export type EventCallback = (params?: any) => void;

export default class EventListener {
    private readonly map: {
        [key: string | number]: EventCallback[]
    };

    constructor() {
        this.map = {}
    }

    public on(event: string, fn: EventCallback[]) {
        if (typeof this.map[event] !== 'undefined') {
            fn.forEach((item) => {
                if (!this.map[event].includes(item)) {
                    this.map[event].push(item);
                }
            });
        } else {
            const copyFn = fn;
            this.map[event] = copyFn;
        }
    }

    public off(event: string, handler: EventCallback) {
        if (typeof this.map[event] !== 'undefined') {
            this.map[event] = this.map[event].filter((fn) => (fn !== handler));
        }
    }

    public fireEvent(event: string, params?: any) {
        this.map[event].forEach((fn) => fn(params));
    }}