/*

 */
// Create a path
let path = [[19, 40], [18, 40], [18, 60], [10, 60]];

// Create a chair
const chair = new Chair(200, 400);

chair.logYourself();

// Get the chair's grid position (cell)
let gridPos = chair.getLocationOnGrid(chair.chair.position.x, chair.chair.position.y);
console.log('Chair grid pos:', gridPos);




/*Events.on(engine, 'afterUpdate', function () {
    console.log(path);
    let moveDirection = chair.whereToMove(path[0]);
    console.log('Moving ', moveDirection);
    if (!chair.isArrived(path[0])) {
        chair.move(moveDirection);
    } else {
        chair.stop();
        path.shift();
    }
});

*/