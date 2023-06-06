import AbstractWidget from '../abstractWidget';

export default class List extends AbstractWidget {
	private rootElement: HTMLDivElement;
	constructor(params: any) {
		super(params);


	}

	public init(): void {
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('list-wrapper');

		// this.items.forEach((item: any, index: number) => {
		// 	const itemWrapper = document.createElement('div');
		// 	itemWrapper.classList.add('list__item');
		//
		// 	this.item(item, index, itemWrapper);
		// });
	}
}