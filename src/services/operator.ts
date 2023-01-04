import {api} from '../index';
import OperatorModel from '../models/operator';

export default class Operator {
    private operatorModel: OperatorModel;
    constructor() {
    }

    public getOperator(): Promise<OperatorModel> {
        if (this.operatorModel) {
            return Promise.resolve(this.operatorModel);
        }

        return api.getOperator().then((response: any) => {
            this.operatorModel = new OperatorModel(response);

            return this.operatorModel;
        })
    }
}