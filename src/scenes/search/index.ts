import {AbstractScene} from '../abstractScene';
import {manager, rooms} from '../../index'
import RoomModel from '../../models/room';
import List from '../../widgets/list/index';
import Card from '../../widgets/card';
import {SceneParams} from '../manager';
import {SearchParams} from '../../widgets/form/search';
import ListWithPaginate from '../../widgets/list/index';
import {POSITION} from '../../widgets/list/pagination';

export default class Search extends AbstractScene {
	private rooms: RoomModel[];
	private filterWrapper: HTMLDivElement;
	private roomsWrapper: HTMLDivElement;
	private emptyList: HTMLDivElement;
	private emptyText: HTMLDivElement;
	private emptyIcon: HTMLDivElement;
	private list: List;
	private roomsCount: number;
	private from: any;
	private to: any;
	private page: number;
	private searchParams: SearchParams;

	constructor(params: SceneParams) {
		super(params);
		this.from = params.params.from;
		this.to = params.params.to;
		this.page = 0;

		this.onBack =  this.onBack.bind(this);
		this.initItem = this.initItem.bind(this);
		this.onChangePage = this.onChangePage.bind(this);
	}

	afterDOMShow() {
		super.afterDOMShow();
	}

	beforeDOMHide() {
		super.beforeDOMHide();
	}

	public onBack(): void {
		return manager.goBack();
	}

	protected initWidgets(): void {
		super.initWidgets();

		this.initFilterWrapper();

		this.initRoomsWrapper();

		this.initTitle(this.roomsWrapper);

		if (this.rooms && this.rooms.length > 0) {
			this.initList(this.rooms);
		} else {
			this.initEmptyList();
		}

		this.initFooter();
	}

	private initFilterWrapper(): void {
		this.filterWrapper = document.createElement('div');
		this.filterWrapper.classList.add(`scene__${this.name}_filter-wrapper`);
		this.contentWrapper.append(this.filterWrapper);
	}

	private initRoomsWrapper(): void {
		this.roomsWrapper = document.createElement('div');
		this.roomsWrapper.classList.add(`scene__${this.name}_rooms-wrapper`);
		this.contentWrapper.append(this.roomsWrapper);
	}

	protected getTitle(): string {
		return 'Номера, которые мы для вас подобрали';
	}

	private initItem(item: any, index: number, wrapper: HTMLDivElement): any {
		const card = new Card(item, `card-room-${index + 1}`);

		return card;
	}

	private onChangePage(page: number): void {
		console.log('search page',  page)
		this.setPage(page);
		this.loadPage().catch(null);
	}

	private setPage(page: number): void {
		this.page = page;
	}

	private initList(items: any): void {
		this.list = new ListWithPaginate({
			size: 1,
			id: 'super-list',
			items,
			page: this.page,
			item: this.initItem,
			itemSize: {
				width: 270,
				height: 257,
				columnGap: 12,
				rowGap: 20,
			},
			quantity: Math.round(this.roomsCount / 1),
			position: POSITION.TOP,
			onChangePage: this.onChangePage
		});

		this.list.init();
		this.widgets.push(this.list);

		this.roomsWrapper.append(this.list.getRoot());
	}

	private initEmptyList(): void {
		this.emptyList = document.createElement('div');
		this.emptyList.classList.add(`scene__${this.name}_empty-list`);
		this.emptyIcon = document.createElement('div');
		this.emptyIcon.classList.add(`scene__${this.name}_empty-list-icon`, 'material-icons');
		this.emptyIcon.innerText = 'search'

		this.emptyList.append(this.emptyIcon);

		this.emptyText = document.createElement('div');
		this.emptyText.innerText = 'к сожалению ничего не найдено';
		this.emptyText.classList.add(`scene__${this.name}_empty-list-text`);
		this.emptyList.append(this.emptyText);

		this.roomsWrapper.append(this.emptyList);
	}

	private loadPage(): Promise<any> {
		return rooms.getSearchRooms({page: this.page, pageSize: 1, searchParams: this.searchParams})
			.then((response: RoomModel[]) => {
				if (this.rooms && this.rooms.length > 0) {
					this.rooms.concat(response);
				} else {
					this.rooms = response;
				}

				this.setOptions({rooms: this.rooms});
			})
	}

	private setSearchParams(searchParams: SearchParams) {
		this.searchParams = searchParams;
	}

	public open(params: SceneParams): Promise<any> {
		this.setSearchParams(params.params);

		return this.loadOperatorData()
			.then(() => {
				return rooms.getSearchRoomsCounts(this.searchParams)
					.then((response: number) => {
						this.roomsCount = response;

						this.setOptions({roomsCount: this.roomsCount});
					})
					.then(() => {
						return this.loadPage();
					});
			})
			.then(() => {
				this.initWidgets();
			});
	}
}
