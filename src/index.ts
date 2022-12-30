import './scenes/style.styl';
import Manager from './scenes/manager';

export const manager = new Manager();

manager.open(Manager.SCENE_HOME);
