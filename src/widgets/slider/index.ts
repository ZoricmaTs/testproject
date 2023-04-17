import AbstractWidget from '../abstractWidget';
import './style.styl';
import {screen} from '../../index';
import Screen from '../../services/screen';
import Btn, {ButtonType} from '../btn';

export type SliderItem = {
  image: string,
  title?: string,
}

export default class Slider extends AbstractWidget {
  private items: SliderItem[];
  private rootElement: HTMLDivElement;
  private sliderWrapper: HTMLDivElement;
  private leftButton: Btn;
  private rightButton: Btn;
  private activeIndex: number;
  private indicatorsWrapper: HTMLDivElement;
  private indicators: HTMLDivElement[];

  constructor(params: SliderItem[]) {
    super(params);

    this.items = params;

    this.updateWrapperWidth = this.updateWrapperWidth.bind(this);
    this.onPressLeftButton = this.onPressLeftButton.bind(this);
    this.onPressRightButton = this.onPressRightButton.bind(this);
    this.setActiveIndex(0);
  }

  private getMaxIndex(): number {
    return this.items.length - 1;
  }

  private setActiveIndex(index: number): any {
    this.activeIndex = index;
  }

  public init(): void {
    this.initWrapper();
    this.createItems();
    this.initIndicators();
    this.createButtons();
  }

  private initWrapper(): void {
    this.rootElement = document.createElement('div');
    this.rootElement.classList.add('slider');

    this.sliderWrapper = document.createElement('div');
    this.sliderWrapper.classList.add('slider__wrapper');

    this.rootElement.append(this.sliderWrapper);
  }

  private createItems(): void {
    this.items.forEach((item: SliderItem) => {
      const container = document.createElement('div');
      container.style.background = `url(${item.image}) no-repeat center center/cover`;
      container.classList.add('slider__item');
      this.sliderWrapper.append(container);

      if (item.title && item.title.length > 0) {
        const title = document.createElement('div');
        title.classList.add('slider__item-title');
        title.innerText = item.title;

        container.append(title);
      }
    })
  }

  public getRoot(): HTMLDivElement {
    return this.rootElement;
  }

  private updateWrapperWidth(): void {
    const width = this.sliderWrapper.parentElement.clientWidth * this.items.length;
    this.sliderWrapper.style.width = `${width}px`;
  }
  
  private onPressLeftButton(): void {
    if (this.activeIndex - 1 >= 0) {
      this.setActiveIndex(this.activeIndex - 1);
    } else {
      this.setActiveIndex(this.getMaxIndex());
    }

    this.updatePosition();
    this.updateActiveIndicator();
  }

  private updatePosition(): void {
    const position = this.sliderWrapper.parentElement.clientWidth * this.activeIndex;
    this.sliderWrapper.style.transform = `translateX(-${position}px)`;
  }

  private onPressRightButton(): void {
    if (this.activeIndex + 1 <= this.getMaxIndex()) {
      this.setActiveIndex(this.activeIndex + 1);
    } else {
      this.setActiveIndex(0);
    }

    this.updatePosition();
    this.updateActiveIndicator();
  }

  private updateActiveIndicator(): void {
    this.indicators.forEach((indicator, index) => {
      if (index === this.activeIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  private createButtons(): void {
    if (this.items.length >= 1) {
      this.leftButton = new Btn({
        title: '',
        onPress: this.onPressLeftButton,
        type: ButtonType.TEXT_WITH_ICON,
        classes: ['slider__button', 'slider__button_left'],
        icon: 'navigate_before',
        iconClasses: ['slider__button_icon']
      });

      this.rightButton = new Btn({
        title: '',
        onPress: this.onPressRightButton,
        type: ButtonType.TEXT_WITH_ICON,
        classes: ['slider__button', 'slider__button_right'],
        icon: 'navigate_next',
        iconClasses: ['slider__button_icon']
      });

      this.leftButton.init();
      this.rightButton.init();
      this.widgets.push(this.leftButton);
      this.widgets.push(this.rightButton);
      this.rootElement.append(this.leftButton.getRoot());
      this.rootElement.append(this.rightButton.getRoot());
    }
  }

  protected initIndicators(): void {
    this.indicators = [];
    this.indicatorsWrapper = document.createElement('div');
    this.indicatorsWrapper.classList.add('slider__indicators');

    this.items.forEach((item: SliderItem, index: number) => {
      const indicator = document.createElement('div');

      indicator.classList.add('slider__indicators_item');
      this.updateActiveIndicator();

      this.indicators.push(indicator);
      this.indicatorsWrapper.append(indicator);
    })

    this.rootElement.append(this.indicatorsWrapper);
  }

  public afterDOMShow() {
    super.afterDOMShow();

    this.updateWrapperWidth();
  }

  protected addEvents():void {
    super.addEvents();

    screen.on(Screen.EVENT_RESIZE, [this.updateWrapperWidth]);
  }

  protected removeEvents() {
    super.removeEvents();

    screen.off(Screen.EVENT_RESIZE, this.updateWrapperWidth);
  }
}