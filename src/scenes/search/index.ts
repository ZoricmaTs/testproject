import {AbstractScene} from '../abstractScene';
import Index, {ButtonType} from '../../widgets/btn';
import {manager, operator, rooms, user} from '../../index';
import {SearchParams} from '../../widgets/form/search';
import UserModel from '../../models/user';
import Operator from '../../models/operator';
import RoomModel from '../../models/room';

export default class Search extends AbstractScene {
    private button: Index;
    private rooms: RoomModel[];

    constructor(params: any) {
        super(params);

        this.initButton();
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
              return rooms.getSearchRooms({page: 0, pageSize: 5, searchParams})
                .then((response: RoomModel[]) => {
                    this.rooms = response;
                    console.log('response', response);
                    this.setOptions({rooms: this.rooms});
                })
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
