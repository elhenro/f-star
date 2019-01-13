import Simulation from './Simulation';

/**
 * Simple function to get the angle from a direction vector.
 * @param x Horizontal component of direction vector.
 * @param y Vertical component of direction vector.
 * @returns {number} The angle in degrees.
 */
function getAngle({x, y}) {
    const angle = Math.atan2(y, x);   //radians
    const degrees = 180 * angle / Math.PI;  //degrees
    return (360 + Math.round(degrees)) % 360;
}

/**
 * Simple example function to move bot promise-based in the simulation.
 * @param chair The chair to move.
 * @param end The point {x:<number>, y:<number>} to aim for.
 * @returns {Promise<any>} A promise fulfilled when a chair reaches its position.
 */
function goTo(chair, end) {

    const result = new Promise((resolve, reject) => {

        let {x, y, bearing} = chair.getPosition();
        let angle = bearing;

        const endAngle = 90 + getAngle({x: end.x - x, y: end.y - y});

        const dir = Math.abs(endAngle - angle) > 180 ? -1 : 1;

        let interval = setInterval(() => {
            let {x, y, bearing} = chair.getPosition();

            const angle = bearing;
            const vector = {x: end.x - x, y: end.y - y};

            const distance = Math.sqrt(
                Math.pow(vector.x, 2) + Math.pow(vector.y, 2));

            if (Math.abs(endAngle - angle) > 7.5) {
                chair.move({motionType: 'Rotation', velocity: 0.5 * dir});
            } else if (Math.abs(endAngle - angle) > 0.5) {
                chair.move({motionType: 'Rotation', velocity: 0.01 * dir});
            } else if (distance > 50) {
                chair.move({motionType: 'Straight', velocity: 2.0});
            } else if (distance > 15) {
                chair.move({motionType: 'Straight', velocity: 0.25});
            } else {
                chair.stop();
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });

    return result;
}


// Starting point of the simulation

const simulation = new Simulation({
    element: document.querySelector('main'),
    width: 600,
    height: 600,
    positions: [{x: 100, y: 100}, {x: 500, y: 500}]
});

const control = simulation.getChairControl();

control.onReady = () => {
    console.log(control.ready);

    const [chair1, chair2] = control.getChairs();

    Promise.all([

        goTo(chair1, {x: 300, y: 100})
            .then(() => goTo(chair1, {x: 300, y: 300}))
            .then(() => goTo(chair1, {x: 200, y: 200}))
            .then(() => {
                console.log("Stuhl 1 Ziel erreicht!");
            }),

        goTo(chair2, {x: 100, y: 500})
            .then(() => goTo(chair2, {x: 100, y: 100}))
            .then(() => {
                console.log("Stuhl 2 Ziel erreicht!");
            })

    ]).then(()=> {
        control.shutdown();
    })
}

control.start();