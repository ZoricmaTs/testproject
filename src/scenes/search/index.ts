import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager, operator, rooms, user} from '../../index';
import {SearchParams} from '../../widgets/form/search';
import RoomModel from '../../models/room';

export default class Search extends AbstractScene {
	private button: Index;
	private rooms: RoomModel[];

	constructor(params: any) {
		super(params);

		this.onBack =  this.onBack.bind(this);
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

		this.initButton();
		this.initFooter();
	}

    public initButton(): void {
			this.button = new Index({
				title: 'back',
				classes: ['back-button'],
				onPress: this.onBack,
				type: ButtonType.TEXT,
			});

			this.button.init();
			this.getContainer().append(this.button.getRoot());
			this.widgets.push(this.button);
    }

    public open(searchParams?: SearchParams): Promise<any> {
			return this.loadOperatorData()
				.then(() => this.initWidgets())
				.then(() => {
					return rooms.getSearchRooms({page: 0, pageSize: 5, searchParams})
						.then((response: RoomModel[]) => {
							this.rooms = response;
							console.log('response', response);
							this.setOptions({rooms: this.rooms});
						});
				})
			return Promise.all([operator.getOperator(), user.getUser(), rooms.getSearchRooms({page: 0, pageSize: 5, searchParams})])
				.then((response) => {
					this.operator = response[0];
					this.setOptions({operator: this.operator});
					this.user = response[1];
					this.rooms = response[2];

					this.setOptions({user: this.user, operator: this.operator, rooms: this.rooms});
				})
				.catch((err) => console.log('err open SEARCH', err));
	}
}
