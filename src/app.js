import Simulation from './Simulation';
import GetRoute from "../oldThings/getRoute.js";
import ChairController from '../oldThings/chair.js';

window.chairs = [
    {x: 103, y: 103},
    {x: 200, y: 200},
    {x: 400, y: 400}
];

// config for start values all actors are spawned with
//set default chair speeds etc.
window.chairConfig = {
    finalRotationAngle        : null,
    direction                 : "",
    wantedAngularRotation     : null,
    rotationSpeed             : 0.5,
    driveReady                : false,
    rotationReady             : true,
    stepIndex                 : 0,
    moveSpeed                 : 0.5,
    timeout                   : 50,
    forceX                    : 0,
    forceY                    : 0,
    rotationIntervalTime      : 20,
    moveIntervalTime          : 10,
    rotationIntervalID        : null,
    moveIntervalID            : null,
    arrivedState              : false,
};

let chairControllers = [];

window.debug = true;

const simulation = new Simulation({
    element: document.querySelector('main'),
    width: 600,
    height: 600,
    positions: window.chairs
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
                console.log("failed to add obstacle: ",window.obstacles)
            }
        });
    };

    function addObstacle(obstacle) {
        window.obstacles.push(obstacle)
    }

    window.go = function(index, target, finalRotationAngle = 0){
        let path = new GetRoute(chairControllers[index].chairControl.getPosition(), target, window.obstacles);
        chairControllers[index].followPath(path, finalRotationAngle);
    };

    window.control = control.getChairs();
    //console.log(window.control);

    for (let i = 0; i < window.chairs.length; i++){
        chairControllers.push(new ChairController(window.control[i], i));
        //addObstacle([i, window.control[i].getPosition().x, window.control[i].getPosition().y]); //todo: obj
    }

    console.log("chair simulation spawned:",chairControllers);
    // is empty?
    //console.log('obstacles found: ', window.obstacles);

    let path = new GetRoute(chairControllers[0].chairControl.getPosition(), {x: 3, y: 4}, window.obstacles);
    //chairControllers[0].followPath(path);

    path = new GetRoute(chairControllers[1].chairControl.getPosition(), {x: 5, y: 2}, window.obstacles);
    //chairControllers[1].followPath(path);

    path = new GetRoute(chairControllers[2].chairControl.getPosition(), {x: 1, y: 2}, window.obstacles);
    //chairControllers[2].followPath(path);
}

// start
control.start();