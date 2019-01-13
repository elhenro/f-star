import Simulation from './Simulation';

import GetRoute from "../oldThings/getRoute.js";

import ChairController from '../oldThings/chair.js';

const simulation = new Simulation({
    element: document.querySelector('main'),
    width: 600,
    height: 600,
    positions: [{x: 100, y: 100}/*, {x: 500, y: 500}*/]
});

const control = simulation.getChairControl();

control.onReady = () => {
    window.obstacles = [];

    window.updateObstacle = function (id, x, y) {
        window.obstacles.forEach(function (obstacle, i) {
            // if id matches
            if (obstacle[0] === id) {
                // update x and y value for this id
                window.obstacles[i][1] = x;
                window.obstacles[i][2] = y;
            } else {
                window.obstacle[i][0] = id;
                window.obstacle[i][1] = x;
                window.obstacle[i][2] = y;
            }
        });
    };
    function addObstacle(obstacle) {
       //window.obstacles = window.obstacles.concat([[id, x, y]]);
       window.obstacles.push(obstacle)
    }

    window.control = control.getChairs(); 

    let newId = control.getChairs().length
    let chairPos =  control.getChairs()[0].getPosition()

    let c1 = new ChairController(control.getChairs()[0], newId)
    console.log(window.obstacles);
    addObstacle([newId,chairPos.x, chairPos.y]); //todo: obj
    console.log(window.obstacles);

    c1.debug = true;

    let target = {x: 3, y: 4};

    let path = new GetRoute(chairPos, target, window.obstacles);

    // initialize
    c1.followPath(path)
}

// start
control.start();