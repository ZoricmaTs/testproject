import './scenes/style.styl';
import Manager, {Scenes} from './scenes/manager';

export const manager = new Manager();

manager.open(Scenes.Home, {name: 'home', route: 'home'});
