import {AbstractScene} from '../abstractScene';
import Index from '../../widgets/btn';
import {manager, operator, rooms, user} from '../../index'
import RoomModel from '../../models/room';
import List from '../../widgets/list';
import Card from '../../widgets/card';
import {SceneParams, Scenes} from '../manager';
import {SearchParams} from '../../widgets/form/search';

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

	constructor(params: SceneParams) {
		super(params);
		this.from = params.params.from;
		this.to = params.params.to;

		this.onBack =  this.onBack.bind(this);
		this.roomRender = this.roomRender.bind(this);
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
			console.log('initList');
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

	private roomRender(item: any, index: number, wrapper: HTMLDivElement): any {
		const card = new Card(item, `card-room-${index + 1}`);
		card.init();
		wrapper.append(card.getRoot());

		this.list.getRoot().append(wrapper);
		card.afterDOMShow();
		this.widgets.push(card);
	}

	private initList(items: any): void {
		this.list = new List({
			size: 5,
			id: 'super-list',
			items,
			page: 0,
			itemRender: this.roomRender,
			itemSize: {
				width: 270,
				height: 257,
				columnGap: 12,
				rowGap: 20,
			}
		});

		this.list.init()
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

	public open(params: SceneParams): Promise<any> {
		const searchParams: SearchParams = params.params;

		return this.loadOperatorData()
			.then(() => {
				return rooms.getSearchRoomsCounts(searchParams)
					.then((response: number) => {
						this.roomsCount = response;

						this.setOptions({roomsCount: this.roomsCount});
					})
					.then(() => {
						return rooms.getSearchRooms({page: 0, pageSize: 5, searchParams})
							.then((response: RoomModel[]) => {
								this.rooms = response;

								this.setOptions({rooms: this.rooms});
							})
					});
			})
			.then(() => this.initWidgets())

		// return Promise.all([operator.getOperator(), user.getUser(), rooms.getSearchRooms({page: 0, pageSize: 5, searchParams})])
		// 	.then((response) => {
		// 		this.operator = response[0];
		// 		this.setOptions({operator: this.operator});
		// 		this.user = response[1];
		// 		this.rooms = response[2];
		//
		// 		this.setOptions({user: this.user, operator: this.operator, rooms: this.rooms});
		// 	})
		// 	.catch((err) => console.log('err open SEARCH', err));
	}
}
