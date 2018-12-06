// Create a chair
/*const chair = new Chair(200, 400);
chair.logYourself();
*/
let chairs = [];

window.obstacles = [];
$(document).ready(function () {

    //let path = [[19, 40],[18, 40],[17, 40],[17,39],[17,38],[17,37],[17,36],[17,35],[16,35],[15,35],[15,34]];
    //let path = [[19, 40], [18, 40], [17, 40], [17, 39], [17, 38], [17, 37], [18, 37], [19, 37], [19, 38], [19, 39]];
    //let path = [[20, 41],[20,42],[20,43],[20,44]];
    
    // todo: function to check path for validity: always only one step X or Y
    // let path = [[21,40],[22,40],[22,41],[23,41]];
    window.chair = new Chair;

    window.go = function (index) {
        console.log('Chair ' + index + ' los gehts!');

        let chairPos = chairs[index].getLocationOnGrid(chairs[index].chair.position);
        let mockMap = getRoute(chairPos);

        console.log('Path for ', chairs[index], " - ", mockMap);

        let path = [[19,20],[18,20],[17,20],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20],[7,20],[6,20]];

        //chairs[index].followPath(mockMap);
        chairs[index].followPath(path);
    };

    //let chair = new Chair();
    window.createChair = function (posX, posY) {
        let chair = new Chair(posX, posY);

        chairs.push(chair);

        addObstacle(posX, posY);
    };

    window.showChairs = function () {
        console.log(chairs);
    };

    window.pathTo = function (posX, posY) {
        // todo: (2.) get path from aframe
        let path = pathTo([posX, posY])
        console.log(path)
    }


    // TESTING
    // path 300, 200
    window.createChair(100, 200)

    window.createChair(200, 200)

    go(1);

    function addObstacle(x,y){
        window.obstacles = window.obstacles.concat([[x,y]]);
    }
});

