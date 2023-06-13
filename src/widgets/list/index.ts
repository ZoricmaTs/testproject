import AbstractWidget from '../abstractWidget';
import ListSimple, {ItemParams} from './listSimple';
import Pagination from './pagination';

export default class ListWithPaginate extends AbstractWidget {
	private rootElement: HTMLDivElement;
	protected id: number | string;
	protected page: number;
	protected size: number;
	protected items: any;
	protected quantity: number;
	protected item: (item: any, index: number, wrapper: HTMLDivElement) => void;
	protected itemSize: ItemParams;
	protected list: ListSimple;
	protected pagination: Pagination;
	protected onChangePage: (page: number) => void;

	constructor(params: any) {
		super(params);

		this.page = params.page;
		this.size = params.size;
		this.items = params.items;
		this.id = params.id;
		this.item = params.item;
		this.itemSize = params.itemSize;
		this.quantity = params.quantity;
		this.onChangePage = params.onChangePage;
		this.onChange = this.onChange.bind(this);
	}

	public init(): void {
		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('list-wrapper');

		this.initList();
		this.initPagination();
	}

	protected initList(): void {
		this.list = new ListSimple({
			size: this.size,
			id: `super-list-${this.id}`,
			items: this.items,
			page: this.page,
			item: this.item,
			itemSize: this.itemSize,
		});

		this.list.init();
		this.widgets.push(this.list);
		this.rootElement.append(this.list.getRoot());
	}

	protected onChange(page: number): void {
		if (this.onChangePage) {
			this.onChangePage(page);
			this.setPage(page);
		}
		console.log('listonChange page', page)
	}

	protected setPage(page: number): void {
		this.page = page;
	}

	protected initPagination(): void {
		this.pagination = new Pagination({
			quantity: this.quantity,
			page: this.page,
			onChange: this.onChange,
		});

		this.pagination.init();
		this.widgets.push(this.pagination);

		this.rootElement.append(this.pagination.getRoot());
	}

	public getRoot(): HTMLDivElement {
		return this.rootElement;
	}
}