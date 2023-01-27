import AbstractWidget from '../abstractWidget';
import './style.styl';

export type CheckboxParams = {
    id: string,
    title: string,
    text?: string,
    checked?: boolean,
    disabled?: boolean
}

export default class Checkbox extends AbstractWidget {
    private readonly id: string;
    private readonly title: string;
    private readonly text: string;
    private rootElement: Element;
    private input: HTMLInputElement;
    private titleElement: HTMLSpanElement;
    private textElement: HTMLSpanElement;
    private box: HTMLSpanElement;
    private checked: boolean;
    private disabled: boolean;
    constructor(params: CheckboxParams) {
        super(params);

        this.id = params.id;
        this.title = params.title;
        this.text = params.text;
        this.checked = params.checked ?? false;
        this.disabled = params.disabled ?? false;
        this.onChange = this.onChange.bind(this);
    }

    public getRoot(): Element {
        return this.rootElement;
    }

    private createInput(): void {
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'checkbox');
        this.input.setAttribute('id', this.id);
        this.input.setAttribute('name', this.title)
        this.input.setAttribute('value', this.title);

        this.setChecked(this.checked);
        this.setDisabled(this.disabled);
        this.input.classList.add('check__input');
        
        this.box = document.createElement('span');
        this.box.classList.add('check__box');
    }

    private setChecked(checked: boolean): void {
        this.input.checked = checked;
    }

    private setDisabled(disabled: boolean): void {
        this.input.disabled = disabled;
    }

    private createLabel(): void {

    }

    public init(): any {
        this.rootElement = document.createElement('label');
        this.rootElement.setAttribute('for', this.id);
        this.rootElement.classList.add('check');

        this.titleElement = document.createElement('span');
        this.titleElement.classList.add('check__title');
        this.titleElement.innerText = this.title;
        this.rootElement.append(this.titleElement);

        if (this.text) {
            this.textElement = document.createElement('span');
            this.textElement.classList.add('check__text');
            this.textElement.innerText = this.text;
            this.rootElement.append(this.textElement);
        }

        this.createInput();

        this.createLabel();
        this.rootElement.append(this.input);
        this.rootElement.append(this.box);
    }

    private onChange(e: Event):void {
        this.checked = (e.target as HTMLInputElement).checked;
        this.disabled = (e.target as HTMLInputElement).disabled;

        this.setChecked(this.checked);
        this.setDisabled(this.disabled);
    }

    protected addEvents():void {
        this.rootElement.addEventListener('change', this.onChange);
    }

    protected removeEvents(): void {
        this.rootElement.removeEventListener('change', this.onChange);
    }
}