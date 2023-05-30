export type Coordinates = {
	top: number,
	left: number,
	x: number,
	y: number,
	width: number,
	height: number,
}

export type ListenerCallback = (prop: Coordinates) => void;

export class Observer {
	static records: Map<Element, Set<ListenerCallback>> = new Map();
	static nativeObserver: ResizeObserver = Observer.createNativeObserver();

	public static add(element: Element, listenerCb: ListenerCallback): () => void {
		const elementCallbacks = Observer.records.get(element);

		if (!elementCallbacks) {
			Observer.records.set(element, new Set<ListenerCallback>([listenerCb]));

			this.addNativeObservable(element);
		} else {
			const isAdded = elementCallbacks.add(listenerCb);

			if (isAdded) {
				this.addNativeObservable(element);
			}
		}

		return this.getDeleteCallback(element, listenerCb);
	}

	public static remove(element: Element, listenerCb: ListenerCallback) {
		const callbacks = Observer.records.get(element);

		if (callbacks) {
			callbacks.delete(listenerCb);

			if (callbacks.size === 0) {
				this.removeNativeObservable(element);
				Observer.records.delete(element);
			}
		}
	}

	protected static getDeleteCallback(element: Element, listenerCb: ListenerCallback): () => void {
		return () => this.remove(element, listenerCb);
	}

	protected static addNativeObservable(element: Element) {
		Observer.nativeObserver.observe(element);
	}

	protected static removeNativeObservable(element: Element) {
		Observer.nativeObserver.unobserve(element);
	}

	protected static createNativeObserver() {
		return new ResizeObserver((entries) => {
			entries.forEach(entry => {
				const callbacks = Observer.records.get(entry.target);

				callbacks?.forEach((callback) => callback(entry.contentRect));
			});
		});
	}
}

export default Observer;