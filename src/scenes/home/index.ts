import {AbstractScene} from '../abstractScene';
import './style.styl';
import '../scene.styl';
import {manager, operator, rooms, user} from '../../index';
import {Scenes} from '../manager';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import Header from '../../widgets/header';
import RoomModel from '../../models/room';
import Card from '../../widgets/card';

export default class Home extends AbstractScene {
    protected options: any;
    private user: UserModel;
    private operator: Operator;
    private header: Header;
    private background: HTMLImageElement;
    private rooms: RoomModel[];


    constructor(params: any) {
        super(params);

        this.openScene = this.openScene.bind(this);
        this.openAuthScene = this.openAuthScene.bind(this);
    }

    afterDOMShow() {
        super.afterDOMShow();
    }

    beforeDOMHide() {
        super.beforeDOMHide();
    }

    beforeDOMShow() {
        super.beforeDOMShow();

        this.initBackground();
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

    private initHeader(): void {
        this.header = new Header({items: this.operator.getHeaderItems(), user: this.user, isDemo: this.operator.isDemo});
        this.header.init();
        this.getContainer().append(this.header.getRoot());
        this.widgets.push(this.header);
    }

    private initRooms(): void {
        const roomsWrapper = document.createElement('div');
        roomsWrapper.classList.add('cards');
        this.rooms.forEach((room: RoomModel) => {
            const card = new Card(room);
            card.init();

            roomsWrapper.append(card.getRoot());
            this.widgets.push(card);
        });

        this.getContainer().append(roomsWrapper);
    }

    protected initWidgets(): void {
        this.initHeader();
        this.initRooms();
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
                return rooms.getRooms()
                  .then((response: RoomModel[]) => {
                      this.rooms = response;
                        this.setOptions({rooms: this.rooms});
                    });
            })
            .then(() => {
                this.initWidgets();
                if (!this.operator.isDemo && this.user) {
                    this.header.setData({user: this.user, isDemo: this.operator.isDemo});
                }
            })
            .catch((error: ErrorEvent) => console.log(`open ${this.name}`, error));
    }

    protected setOptions(param: { user?: UserModel, operator?: Operator, rooms?: RoomModel[]}) {
        if (this.options) {
            Object.assign(this.options, param);
        } else {
            this.options = param;
        }
    }

    protected getOptions(): any {
        return this.options;
    }
}