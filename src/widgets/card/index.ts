import AbstractWidget from '../abstractWidget';
import './style.styl';
import Slider from '../slider';
import RoomModel from '../../models/room';

export enum AmountType {
  USD = 'usd',
  RUB = 'rub',
}

export type CardData = {
  id: number,
  images: string[],
  comments: number,
  price: number,
  amount: AmountType,
  rate: number,
  lux?: boolean,
}

export default class Card extends AbstractWidget {
  private rootElement: HTMLDivElement;
  private slider: Slider;
  private readonly room: RoomModel;
  private id: string;

  constructor(params: RoomModel, id: string) {
    super(params);
    this.room = params;
    this.id = id
  }

  public getRoot(): HTMLDivElement {
    return this.rootElement;
  }

  public init(): void {
    this.rootElement = document.createElement('div');
    this.rootElement.classList.add('card');

    this.slider = new Slider(this.room.getCardData(), this.id);
    this.slider.init();

    this.rootElement.append(this.slider.getRoot());
    this.widgets.push(this.slider);

    this.initInfo();
  }

  private initInfo(): void {
    const wrapper = document.createElement('div');
    wrapper.classList.add('card__info-wrapper');

    const block = document.createElement('div');
    block.classList.add('card__info-wrapper-block');

    const wrapperNumber = document.createElement('div');
    wrapperNumber.classList.add('card__info-wrapper-block_numb');

    const roomNumber = document.createElement('div');
    roomNumber.classList.add('card__info-wrapper-block_numb_number');
    roomNumber.innerText = `№ ${this.room.id}`;
    wrapperNumber.append(roomNumber);

    if (this.room.lux) {
      const roomStatus = document.createElement('div');
      roomStatus.classList.add('card__info-wrapper-block_numb_status');
      roomStatus.innerText = 'люкс';
      wrapperNumber.append(roomStatus);
    }

    block.append(wrapperNumber);

    const wrapperPrice = document.createElement('div');
    wrapperPrice.classList.add('card__info-wrapper-block_price');

    const price = document.createElement('div');
    price.classList.add('card__info-wrapper-block_price_numb');
    price.innerText = `${this.room.price}${this.room.getAmount()}`;
    wrapperPrice.append(price);

    const priceText = document.createElement('div');
    priceText.classList.add('card__info-wrapper-block_price_text');
    priceText.innerText = 'в сутки';
    wrapperPrice.append(priceText);
    block.append(wrapperPrice);

    wrapper.append(block);

    this.rootElement.append(wrapper);
  }
}