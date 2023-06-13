import AbstractWidget from '../abstractWidget';
import {screen} from '../../index';
import Screen from '../../services/screen';

export type ItemParams = {
	width: number,
	height: number,
	columnGap?: number,
	rowGap?: number,
}

export type ListParams = {
	id: number | string,
	page: number,
	size: number,
	items: any,
	item: any,
	itemSize: ItemParams,
}

export default class ListSimple extends AbstractWidget {
	protected id: number | string;
	protected page: number;
	protected size: number;
	protected items: any;
	protected item: any;
	protected rootElement: HTMLDivElement;
	protected itemSize: ItemParams

	constructor(params: ListParams) {
		super(params);

		this.page = params.page;
		this.size = params.size;
		this.items = params.items;
		this.item = params.item;
		this.id = params.id;
		this.itemSize = params.itemSize;

		this.onResize = this.onResize.bind(this);
	}

	protected itemRender(item: any, index: number, wrapper: HTMLDivElement): void {
		const card = this.item(item);
		card.init();

		wrapper.append(card.getRoot());
		this.rootElement.append(wrapper)

		this.widgets.push(card);
	}

	public afterDOMShow(): void {
		super.afterDOMShow();

		this.update();
	}

	public init(): void {
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('list');

		this.items.forEach((item: any, index: number) => {
			const itemWrapper = document.createElement('div');
			itemWrapper.classList.add('list__item');

			this.itemRender(item, index, itemWrapper);
		});
	}

	public getRoot(): HTMLDivElement {
		return this.rootElement;
	}

	protected update(): void {
		const parentWidth = this.rootElement.getBoundingClientRect().width;
		let itemsCount = Math.round((parentWidth + this.itemSize.columnGap) / (this.itemSize.width + this.itemSize.columnGap));

		const itemsColumnGap = (itemsCount - 1) * this.itemSize.columnGap;
		let newItemWidth = (parentWidth - itemsColumnGap) / itemsCount;
		const minWidth = (this.itemSize.width + this.itemSize.columnGap) * 0.9;

		this.rootElement.style.columnGap = `${this.itemSize.columnGap}px`;
		this.rootElement.style.rowGap = `${this.itemSize.rowGap}px`;

		if (newItemWidth + itemsColumnGap < minWidth && itemsCount > 1) {
			itemsCount -= 1;
		}

		newItemWidth = (parentWidth - itemsColumnGap) / itemsCount;
		const adjustmentPercent = Math.round(newItemWidth * 100 / this.itemSize.width);
		const newItemHeight = adjustmentPercent * this.itemSize.height / 100;

		const items = this.rootElement.querySelectorAll('.list__item');

		items.forEach((item: HTMLDivElement) => {
			item.style.width = `${newItemWidth}px`;
			item.style.height = `${newItemHeight}px`;
		});
	}

	protected loadPage(): void {

	}

	protected onResize(): void {
		this.update();
	}

	protected addEvents():void {
		super.addEvents();

		screen.on(Screen.EVENT_RESIZE, [this.onResize]);
	}

	protected removeEvents() {
		super.removeEvents();

		screen.off(Screen.EVENT_RESIZE, this.onResize);
	}
}