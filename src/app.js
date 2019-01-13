import Simulation from './Simulation';

import GetRoute from "../oldThings/getRoute.js";

import ChairController from '../oldThings/chair.js';

let chairs = [{
    x: 100,
    y: 100
},
    {
        x: 200,
        y: 200
    }];

let chairControllers = [];

const simulation = new Simulation({
    element: document.querySelector('main'),
    width: 600,
    height: 600,
    positions: chairs
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
            } else if(obstacle[0],obstacle[1],obstacle[2]){
                window.obstacles[i][0] = id;
                window.obstacles[i][1] = x;
                window.obstacles[i][2] = y;
            } else {
                console.log("couldnt add obstacle: ",window.obstacles)
            }
        });
    };

    function addObstacle(obstacle) {
        //window.obstacles = window.obstacles.concat([[id, x, y]]);
        window.obstacles.push(obstacle)
    }

    window.control = control.getChairs();

    console.log(window.control);

    let i = 0;
    for (let chair of chairs){
        chairControllers.push(new ChairController(window.control[i], i));
        addObstacle([i, window.control[i].getPosition().x, window.control[i].getPosition().y]); //todo: obj
        i++;
    }

    console.log(chairControllers);
    console.log('obstacles2', window.obstacles);
    let path = new GetRoute(chairControllers[0].chairControl.getPosition(), {x: 3, y: 4}, window.obstacles);
    chairControllers[0].followPath(path);
}

// start
control.start();