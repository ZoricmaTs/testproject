import AbstractWidget from '../abstractWidget';
import './style.styl';

export type ItemParams = {
    id: string,
    value: string,
    checked?: boolean,
    label: string,
}

export enum Position {
    ROW = 'row',
    COLUMN = 'column',
}

export type RadioButtonParams = {
    id: string,
    title?: string,
    name: string,
    buttons: ItemParams[],
    onChange: (id: string) => void;
    buttonsPosition?: Position,
}

export default class RadioSelector extends AbstractWidget {
    private id: string;
    private readonly title: string;
    private itemsData: ItemParams[];
    private rootElement: HTMLFieldSetElement;
    private items: HTMLLabelElement[];
    private readonly name: string;
    private readonly onChangeButton: (id: string) => void;
    private readonly buttonsPosition: Position;
    private titleElement: HTMLParagraphElement;

    constructor(params: RadioButtonParams) {
        super(params);

        this.id = params.id;
        this.title = params.title;
        this.itemsData = params.buttons;
        this.name = params.name;
        this.onChangeButton = params.onChange;
        this.buttonsPosition = params.buttonsPosition ? params.buttonsPosition : Position.COLUMN;

        this.onChange = this.onChange.bind(this);
    }

    private createItems(): void {
        this.rootElement = document.createElement('fieldset');
        this.rootElement.classList.add('radio-selector');

        if (this.title) {
            this.titleElement = document.createElement('p');
            this.titleElement.classList.add('radio-selector__title');
        }

        this.create();
        this.items.forEach((item) => {
            this.rootElement.append(item);
        })
    }

    private initPosition(wrapper: HTMLDivElement): void {
        const positionClass = this.buttonsPosition === Position.ROW ? '' : ''

    }

    private create(): void {
         this.items = this.itemsData.map((item) => {
             const wrapper = document.createElement('label');
             wrapper.classList.add('radio-selector__item');
             wrapper.setAttribute('for', item.id);

             const text = document.createElement('span');
             text.classList.add('radio-selector__item_text')
             text.innerText = item.label;

             wrapper.append(text);

             const input = document.createElement('input');
             input.classList.add('radio-selector__item_input');
             input.setAttribute('type', 'radio');
             input.setAttribute('id', item.id);
             input.setAttribute('name', this.name)
             input.setAttribute('value', item.value);
             input.checked = item.checked;

             wrapper.append(input);

             const box = document.createElement('div');
             box.classList.add('radio-selector__item_box');

             const boxCheck = document.createElement('div');
             boxCheck.classList.add('radio-selector__item_box-check');

             box.append(boxCheck);
             wrapper.append(box);

            return wrapper;
        });
    }

    public getRoot(): HTMLFieldSetElement {
        return this.rootElement;
    }

    public init(): void {
        this.createItems();
    }

    private onChange(e: Event): void {
        if (this.onChangeButton) {
            const id = (e.target as HTMLInputElement).id;
            this.onChangeButton(id);
        }
    }
    protected addEvents():void {
        this.rootElement.addEventListener('change', this.onChange);
    }

    protected removeEvents(): void {
        this.rootElement.removeEventListener('change', this.onChange);
    }
}