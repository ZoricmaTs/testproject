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
	itemRender: (item: any, index: number, wrapper: HTMLDivElement) => void,
	itemSize: ItemParams,
}

export default class List extends AbstractWidget {
	protected id: number | string;
	protected page: number;
	protected size: number;
	protected items: any;
	protected itemRender: (item: any, index: number, wrapper: HTMLDivElement) => void;
	protected rootElement: HTMLDivElement;
	protected itemSize: ItemParams

	constructor(params: ListParams) {
		super(params);

		this.page = params.page;
		this.size = params.size;
		this.items = params.items;
		this.id = params.id;
		this.itemRender = params.itemRender;
		this.itemSize = params.itemSize;

		this.onResize = this.onResize.bind(this);
	}

	protected item(item: any, index: number, wrapper: HTMLDivElement): void {
		if (this.itemRender) {
			return this.itemRender(item, index, wrapper);
		}
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

			this.item(item, index, itemWrapper);
		});
	}

	public getRoot(): HTMLDivElement {
		return this.rootElement;
	}

	protected update(): void {
		const parentWidth = this.rootElement.getBoundingClientRect().width;
		const itemsCount = Math.floor((parentWidth - this.itemSize.columnGap) / (this.itemSize.width + this.itemSize.columnGap));
		const itemsWidth = itemsCount * this.itemSize.width;
		const itemsVerticalGap = (itemsCount - 1) * this.itemSize.columnGap;
		const restWidth = parentWidth - itemsWidth - itemsVerticalGap;
		const minWidth = (this.itemSize.width + this.itemSize.columnGap) * 0.9;

		this.rootElement.style.columnGap = `${this.itemSize.columnGap}px`;
		this.rootElement.style.rowGap = `${this.itemSize.rowGap}px`;

		if (restWidth < minWidth) {
			const newItemWidth = (parentWidth - itemsVerticalGap) / itemsCount;
			const adjustmentPercent = Math.round(newItemWidth * 100 / this.itemSize.width);
			const newItemHeight = adjustmentPercent * this.itemSize.height / 100;

			const items = this.rootElement.querySelectorAll('.list__item');

			items.forEach((item: HTMLDivElement) => {
				item.style.width = `${newItemWidth}px`;
				item.style.height = `${newItemHeight}px`;
			});
		}
	}

	protected loadPage(): void {

	}

	// private updateRooms(rooms: RoomModel[]): void {
	// 	const lastRoomIndex = this.rooms.length;
	//
	// 	if (rooms) {
	// 		rooms.forEach((room: RoomModel, index) => {
	// 			const id = 'card-room-' + lastRoomIndex + index + 1;
	// 			const card = new Card(room, id);
	// 			card.init();
	//
	// 			card.beforeDOMShow();
	// 			this.roomsWrapper.append(card.getRoot());
	// 			card.afterDOMShow();
	//
	// 			this.widgets.push(card);
	// 		});
	// 	}
	// }

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