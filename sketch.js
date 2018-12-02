/*

 */
// Create a path


// Create a chair
const chair = new Chair(200, 400);
chair.logYourself();

// Get the chair's grid position (cell)
//let gridPos = chair.getLocationOnGrid(chair.chair.position.x, chair.chair.position.y);
//console.log('Chair grid pos:', gridPos);


/* todo: loop erstellen, der dem stuhl sagt, dass er
    sich bewegen soll und wärend dem fahren überprüft
    ob er angekommen ist. falls ja neues ziel geben
    und wiederholen
*/

/* todo: a-star so implementieren, dass der stuhl ein
    2d array bekommt (so wie path oben)
 */

/*
Events.on(engine, 'afterUpdate', function () {
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

$( document ).ready(function() {

    let path = [[19, 40],[18, 40],[17, 40],[17,39],[17,38],[17,37],[17,36],[17,35],[16,35],[15,35],[15,34]];
    //let path = [[20, 41],[20,42],[20,43],[20,44]];

    // todo: function to check path for validity: always only one step X or Y
    //let path = [[21,40],[22,40],[22,41],[23,41]];
    
    chair.followPath(path);
})

