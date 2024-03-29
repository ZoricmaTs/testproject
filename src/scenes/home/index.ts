import {AbstractScene} from '../abstractScene';
import {manager, operator, user} from '../../index';
import {Scenes} from '../manager';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import RoomModel from '../../models/room';
import Card from '../../widgets/card';
import MultipleDropdown, {MultiplyItem, MultiplyType} from '../../widgets/dropdown/multiple';
import SearchForm from '../../widgets/form/search';

export default class Home extends AbstractScene {
	protected options: any;
	private background: HTMLImageElement;
	private rooms: RoomModel[];
	private roomsWrapper: HTMLDivElement;
	private dropdown: MultipleDropdown;
	private formWidget: SearchForm;

	constructor(params: any) {
		super(params);

		this.openScene = this.openScene.bind(this);
		this.openAuthScene = this.openAuthScene.bind(this);

		this.onChangeDropdownValues = this.onChangeDropdownValues.bind(this);
	}

	public afterDOMShow() {
		super.afterDOMShow();
	}

	public beforeDOMHide() {
		super.beforeDOMHide();
	}

	public beforeDOMShow() {
		super.beforeDOMShow();

		this.initBackground();
	}


	protected onScrollScene(ev: Event): void {
		super.onScrollScene(ev);

		if (this.isEndPositionScroll) {
			// this.page += 1;
			// this.loadRooms(this.page)
			//   .then((rooms: RoomModel[]) => this.updateRooms(rooms))
			//   .catch((error) => console.log(error));
		}
	}

	private initBackground(): void {
		this.background = document.createElement('img');
		this.background.classList.add('scene__background');
		this.background.src = require('./background.png');
		this.getContainer().append(this.background);
	}

	public openAuthScene(): Promise<void> {
		return manager.open(Scenes.AUTHORIZATION, {name: 'authorization', route: 'authorization'});
	}

	public openScene(): void {
		console.log('openScene');
	}

	private initDropdown(): void {
		const items: MultiplyItem[] = [
			{
				title: 'взрослые',
				value: 0,
				id: 'dropdown-125_0',
			},
			{
				title: 'дети',
				value: 0,
				id: 'dropdown-125_1',
			},
			{
				title: 'младенцы',
				value: 0,
				id: 'dropdown-125_2',
			}
		];
		const data: MultiplyType = {
			id: `${this.name}-guests`,
			name: 'гости',
			buttonTitle: 'Сколько гостей',
			existPlaceholder: true,
			items,
			onChange: this.onChangeDropdownValues,
			availabilityControlButtons: true,
		}

		this.dropdown = new MultipleDropdown(data);
		this.getContainer().append(this.dropdown.getRoot());
		this.widgets.push(this.dropdown);
	}

	private onChangeDropdownValues(data: any): void {
		console.log('onChangeDropdownValues', data);
	}

	protected getTitle(): string {
		return 'Найдём номера под ваши пожелания';
	}

	private initFormWidget(): void {
		this.formWidget = new SearchForm({title: this.getTitle()});
		this.formWidget.init();
		this.contentWrapper.append(this.formWidget.getRoot());
		this.widgets.push(this.formWidget);
	}

	private initRooms(): void {
		this.roomsWrapper = document.createElement('div');
		this.roomsWrapper.classList.add('cards');

		this.rooms.forEach((room: RoomModel, index: number) => {
			const card = new Card(room, `card-room-${index + 1}`);
			card.init();

			this.roomsWrapper.append(card.getRoot());
			this.widgets.push(card);
		});

		this.getContainer().append(this.roomsWrapper);
	}

	private updateRooms(rooms: RoomModel[]): void {
		const lastRoomIndex = this.rooms.length;

		if (rooms) {
			rooms.forEach((room: RoomModel, index) => {
				const id = 'card-room-' + lastRoomIndex + index + 1;
				const card = new Card(room, id);
				card.init();

				card.beforeDOMShow();
				this.roomsWrapper.append(card.getRoot());
				card.afterDOMShow();

				this.widgets.push(card);
			});
		}
	}

	protected initWidgets(): void {
		super.initWidgets();

		this.initFormWidget();

		this.initFooter();
		// this.initDropdown();
		// this.initRooms();
	}

	public open(): Promise<any> {
		return operator.getOperator()
			.then((response: Operator) => {
				this.operator = response;
				this.setOptions({operator: this.operator});
			})
			.then(() => {
				if (!this.operator.isDemo) {
					return user.getUser()
						.then((response: UserModel) => {
								this.user = response;
								this.setOptions({user: this.user});
						});
				}
			})
			.then(() => {
				this.initWidgets();

				if (!this.operator.isDemo && this.user) {
					this.header.setData({user: this.user, isDemo: this.operator.isDemo});
				}
			})
			.catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
	}
	//
	// private loadRooms(page: number): Promise<RoomModel[]> {
	//     return rooms.getRooms(this.page, 5)
	//       .then((response: RoomModel[]) => {
	//           if (!this.rooms) {
	//               this.rooms = response;
	//           }
	//
	//           this.setOptions({rooms: this.rooms});
	//
	//           return response;
	//       });
	// }
}