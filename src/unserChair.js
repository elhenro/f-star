import Simulation from './Simulation';

import GetRoute from "./../oldThings/getRoute.js";

import ChairController from './../oldThings/chair.js';

const simulation = new Simulation({
    element: document.querySelector('main'),
    width: 600,
    height: 600,
    positions: [{x: 100, y: 100}/*, {x: 500, y: 500}*/]
});

const control = simulation.getChairControl();

control.onReady = () => {
    window.control = control.getChairs(); 

    let c1 = new ChairController(control.getChairs()[0])

    c1.debug = true;

    let target = {x: 3, y: 4};
    let chairPos =  control.getChairs()[0].getPosition()
    //chairs[index].getLocationOnGrid(chairs[index].chair.position);

    let obstacles = []; // todo
    let path = new GetRoute(chairPos, target, obstacles);

    c1.followPath(path)
    //c1.adjustAngle(180)


    // 1 rotate 90deg
//    adjustAngle(chair, 90)
}

control.start();

//    chair.move({motionType: 'Rotation', velocity: 0.5})