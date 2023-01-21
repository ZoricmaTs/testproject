import './scenes/style.styl';
import './fonts/style.styl'
import Manager, {Scenes} from './scenes/manager';
import Api from './services/api';
import User from './services/user';
import Operator from './services/operator';
import Screen from './services/screen';
import EventListener from './event-listener';

export const manager = new Manager();
export const eventListener = new EventListener();
export const api = new Api();
export const user = new User();
export const operator = new Operator();
export const screen = new Screen();

manager.open(Scenes.HOME, {name: 'home', route: 'home'}).catch(null);
