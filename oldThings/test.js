import Simulation from './Simulation';
import GetRoute from "../oldThings/getRoute.js";
import ChairController from '../oldThings/Chair.js';

window.chairs = [
    {x: 100, y: 90}
];

const simulation = new Simulation({
    element: document.querySelector('main'),
    width: 600,
    height: 600,
    positions: window.chairs
});

const SimControl = simulation.getChairControl();

control.onReady = () => {
    for (let i = 0; i < window.chairs.length; i++){
        chairControllers.push(new ChairController(SimControl.getChairs()[i], i));
    }

    window.go(0, {x:4, y:2}, 50);
}

// start
control.start();