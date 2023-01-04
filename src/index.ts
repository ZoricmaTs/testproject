import './scenes/style.styl';
import './fonts/style.styl'
import Manager, {Scenes} from './scenes/manager';
import Api from './services/api';
import User from './services/user';
import Operator from './services/operator';

export const manager = new Manager();
export const api = new Api();
export const user = new User();
export const operator = new Operator();

manager.open(Scenes.HOME, {name: 'home', route: 'home'}).catch(null);
