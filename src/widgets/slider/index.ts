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
  protected readonly items: SliderItem[];
  protected rootElement: HTMLDivElement;
  protected sliderWrapper: HTMLDivElement;
  protected activeIndex: number;
  protected indicatorsWrapper: HTMLDivElement;
  protected indicators: HTMLDivElement[];
  protected id: string;
  private buttons: Btn[];

  constructor(params: SliderItem[], id: string) {
    super(params);

    this.items = params;
    this.id = id;

    this.updateWrapperWidth = this.updateWrapperWidth.bind(this);
    this.onPressLeftButton = this.onPressLeftButton.bind(this);
    this.onPressRightButton = this.onPressRightButton.bind(this);
    this.onHover = this.onHover.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.setActiveIndex(0);
  }

  protected getMaxIndex(): number {
    return this.items.length - 1;
  }

  protected setActiveIndex(index: number): any {
    this.activeIndex = index;
  }

  public init(): void {
    this.initWrapper();
    this.createItems();
    this.initIndicators();
    this.initButtons();
  }

  protected initWrapper(): void {
    this.rootElement = document.createElement('div');
    this.rootElement.classList.add('slider');

    this.sliderWrapper = document.createElement('div');
    this.sliderWrapper.classList.add('slider__wrapper');

    this.rootElement.append(this.sliderWrapper);
  }

  protected createItems(): void {
    this.items.forEach((item: SliderItem) => {
      const container = document.createElement('div');
      container.style.background = `url(${item.image}) no-repeat center center/cover`;
      container.classList.add('slider__item');

      if (item.title && item.title.length > 0) {
        const title = document.createElement('div');
        title.classList.add('slider__item-title');
        title.innerText = item.title;

        container.append(title);
      }

      this.sliderWrapper.append(container);
    })
  }

  public getRoot(): HTMLDivElement {
    return this.rootElement;
  }

  protected updateWrapperWidth(): void {
    if (this.sliderWrapper) {
      const width = this.sliderWrapper.parentElement.clientWidth * this.items.length;
      this.sliderWrapper.style.width = `${width}px`;
    }
  }

  protected onPressLeftButton(): void {
    if (this.activeIndex - 1 >= 0) {
      this.setActiveIndex(this.activeIndex - 1);
    } else {
      this.setActiveIndex(this.getMaxIndex());
    }

    this.updatePosition();
    this.updateActiveIndicator();
  }

  protected updatePosition(): void {
    const position = this.sliderWrapper.parentElement.clientWidth * this.activeIndex;
    this.sliderWrapper.style.transform = `translateX(-${position}px)`;
  }

  protected onPressRightButton(): void {
    if (this.activeIndex + 1 <= this.getMaxIndex()) {
      this.setActiveIndex(this.activeIndex + 1);
    } else {
      this.setActiveIndex(0);
    }

    this.updatePosition();
    this.updateActiveIndicator();
  }

  protected updateActiveIndicator(): void {
    this.indicators.forEach((indicator, index) => {
      if (index === this.activeIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  protected createButtons(): void {
    this.buttons = [
      new Btn({
        title: '',
        onPress: this.onPressLeftButton,
        type: ButtonType.TEXT_WITH_ICON,
        classes: ['slider__button', 'slider__button_left'],
        icon: 'navigate_before',
        iconClasses: ['slider__button_icon']
      }),
      new Btn({
        title: '',
        onPress: this.onPressRightButton,
        type: ButtonType.TEXT_WITH_ICON,
        classes: ['slider__button', 'slider__button_right'],
        icon: 'navigate_next',
        iconClasses: ['slider__button_icon']
      })
    ];
  }

  protected initButtons(): void {
    if (this.items.length > 1) {
      this.createButtons();
      this.buttons.forEach((button: Btn) => {
        button.init();
        this.rootElement.append(button.getRoot());
        this.widgets.push(button);
      })
    }
  }

  protected initIndicators(): void {
    if (this.items.length > 1) {
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
  }

  public afterDOMShow() {
    super.afterDOMShow();

    this.updateWrapperWidth();
  }

  public beforeDOMShow() {
    super.beforeDOMShow();

    this.updateWrapperWidth();
  }

  protected onHover(): void {
    this.updateVisibleButtons(true);
  }

  protected onLeave(): void {
    this.updateVisibleButtons(false);
  }

  protected updateVisibleButtons(isVisible: boolean): void {
    if (this.buttons) {
      if (isVisible) {
        this.buttons.forEach((button: Btn) => {
          button.getRoot().classList.add('show');
          button.getRoot().classList.remove('hide');
        })
      } else {
        this.buttons.forEach((button: Btn) => {
          button.getRoot().classList.add('hide');
          button.getRoot().classList.remove('show');
        })
      }
    }
  }

  protected addEvents():void {
    super.addEvents();

    screen.on(Screen.EVENT_RESIZE, [this.updateWrapperWidth]);

    this.rootElement.addEventListener('mouseover', this.onHover);
    this.rootElement.addEventListener('mouseout', this.onLeave);
  }

  protected removeEvents() {
    super.removeEvents();

    screen.off(Screen.EVENT_RESIZE, this.updateWrapperWidth);

    this.rootElement.removeEventListener('mouseover', this.onHover);
    this.rootElement.removeEventListener('mouseout', this.onLeave);
  }
}