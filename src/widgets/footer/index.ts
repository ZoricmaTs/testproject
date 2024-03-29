import AbstractWidget from '../abstractWidget';
import './style.styl';
import Btn, {ButtonType} from '../btn';
import Logo from '../logo';

export enum ColumnItemType {
  TITLE = 'title',
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link',
  BUTTON = 'button',
}

export default class Footer extends AbstractWidget {
  private rootElement: HTMLElement;
  private itemsData: any;

  constructor(params: any) {
    super(params);

    this.itemsData = params.items;
  }

  public beforeDOMShow() {
    super.beforeDOMShow();
  }

  public getRoot(): any {
    return this.rootElement;
  }

  public init(): void {
    this.rootElement = document.createElement('footer');
    this.rootElement.classList.add('footer');

    this.initColumns(this.getColumnsData());
    this.initColumns(this.getColumnsSocialData());
  }

  protected addEvents():void {
    super.addEvents();
  }

  protected removeEvents(): void {
    super.removeEvents();
  }

  protected initItemColumn(item: any, parentElement: HTMLDivElement): void {
    switch (item.type) {
      case ColumnItemType.TITLE:
        const title = document.createElement('div');
        title.classList.add('footer__column_item', 'title');
        title.innerText = item.text;
        parentElement.append(title);
        break;

      case ColumnItemType.TEXT:
        const text = document.createElement('div');
        text.classList.add('footer__column_item', 'text');
        text.innerText = item.text;
        parentElement.append(text);
        break;

      case ColumnItemType.IMAGE:
        const logo = new Logo({});
        logo.init();
        logo.getRoot().classList.add('footer__column_item')
        parentElement.append(logo.getRoot());
        break;

      case ColumnItemType.LINK:
        const link = new Btn({
          title: item.text,
          onPress: () => console.log('open SCENE'),
          type: ButtonType.TEXT,
          classes: ['footer__column_item', 'link'],
          id: item.id
        });

        link.init();
        parentElement.append(link.getRoot());

        this.widgets.push(link);
        break;

      case ColumnItemType.BUTTON:
        const button = new Btn({
          title: item.text,
          onPress: () => console.log('open SCENE'),
          type: ButtonType.TEXT,
          classes: ['footer__column_item', 'icon'],
          id: item.id
        });

        const i = document.createElement('i');

        item.classes.forEach((className: string) => {
          i.classList.add(className);
        });

        button.init();
        button.getRoot().append(i);
        parentElement.append(button.getRoot());

        this.widgets.push(button);
        break;
    }
  }

  protected initColumns(data: any): void {
    const columnsWrapper = document.createElement('div');
    columnsWrapper.classList.add('footer__columns-wrapper');

    data.forEach((columnData: any) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('footer__column');

      columnData.forEach((item: any) => {
        this.initItemColumn(item, wrapper);

        columnsWrapper.append(wrapper);
      });
    });

    this.rootElement.append(columnsWrapper);
  }

  protected getColumnsData(): any {
    return [
      [
        {
          type: ColumnItemType.IMAGE,
          id: 0,
        },
        {
          type: ColumnItemType.TEXT,
          id: 1,
          text: 'Бронирование номеров в лучшем отеле 2019 года по версии ассоциации «Отельные взгляды»',
        }
      ],
      [
        {
          type: ColumnItemType.TITLE,
          id: 0,
          text: 'навигация',
        },
        {
          type: ColumnItemType.LINK,
          id: 1,
          text: 'О нас',
        },
        {
          type: ColumnItemType.LINK,
          id: 2,
          text: 'Новости',
        },
        {
          type: ColumnItemType.LINK,
          id: 3,
          text: 'Служба поддержки',
        },
        {
          type: ColumnItemType.LINK,
          id: 4,
          text: 'Услуги',
        },
      ],
      [
        {
          type: ColumnItemType.TITLE,
          id: 0,
          text: 'о нас',
        },
        {
          type: ColumnItemType.LINK,
          id: 1,
          text: 'О сервисе',
        },
        {
          type: ColumnItemType.LINK,
          id: 2,
          text: 'Наша команда',
        },
        {
          type: ColumnItemType.LINK,
          id: 3,
          text: 'Вакансии',
        },
        {
          type: ColumnItemType.LINK,
          id: 4,
          text: 'Инвесторы',
        },
      ],
      [
        {
          type: ColumnItemType.TITLE,
          id: 0,
          text: 'Служба поддержки',
        },
        {
          type: ColumnItemType.LINK,
          id: 1,
          text: 'Соглашения',
        },
        {
          type: ColumnItemType.LINK,
          id: 2,
          text: 'Сообщества',
        },
        {
          type: ColumnItemType.LINK,
          id: 3,
          text: 'Связь с нами',
        },
      ],
    ];
  }

  protected getColumnsSocialData(): any {
    return [
      [
        {
          type: ColumnItemType.TEXT,
          id: 0,
          text: 'Copyright © 2018 Toxin отель. Все права защищены.',
        },
      ],
      [
        {
          type: ColumnItemType.BUTTON,
          id: 0,
          text: '',
          classes: ['fa-brands', 'fa-twitter'],
        },
        {
          type: ColumnItemType.BUTTON,
          id: 1,
          text: '',
          classes: ['fa-brands','fa-facebook'],
        },
        {
          type: ColumnItemType.BUTTON,
          id: 2,
          text: '',
          classes: ['fa-brands', 'fa-instagram'],
        },
      ],
    ];
  }
}