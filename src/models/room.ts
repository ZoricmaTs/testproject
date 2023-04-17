import {AmountType} from '../widgets/card';
import {SliderItem} from '../widgets/slider';

export type RoomData = {
    id: number,
    images: string[],
    comments: number,
    price: number,
    amount: AmountType,
    rate: number,
    lux: boolean,
}

export default class RoomModel {
    public id: number;
    public lux: boolean;
    private readonly images: string[];
    public price: number;
    private readonly amount: AmountType;

    constructor(params: RoomData) {
        this.id = params.id;
        this.images = params.images;
        this.lux = params.lux;
        this.price = params.price;
        this.amount = params.amount;
    }

    public getAmount(): string {
        if (this.amount === AmountType.RUB) {
            return '₽';
        }

        return '$';
    }

    public getImages(): string[] {
        return this.images;
    }

    public getCardData(): SliderItem[] {
        return this.images.map((image: string) => {
            return {image, title: ''};
        });
    }
}