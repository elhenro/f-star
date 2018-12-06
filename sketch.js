// Create a chair
/*const chair = new Chair(200, 400);
chair.logYourself();
*/
let chairs = [];

$(document).ready(function () {

    //let path = [[19, 40],[18, 40],[17, 40],[17,39],[17,38],[17,37],[17,36],[17,35],[16,35],[15,35],[15,34]];
    let path = [[19, 40], [18, 40], [17, 40], [17, 39], [17, 38], [17, 37], [18, 37], [19, 37], [19, 38], [19, 39]];
    //let path = [[20, 41],[20,42],[20,43],[20,44]];

    // todo: function to check path for validity: always only one step X or Y
    // let path = [[21,40],[22,40],[22,41],[23,41]];
    window.go = function (index) {
        console.log('Chair ' + index + ' los gehts!');

        let chairPos = chairs[index].getLocationOnGrid(chairs[index].chair.position);
        let mockMap = getRoute(chairPos);
        console.log('Path', mockMap);
        chairs[index].followPath(mockMap);
    };

    //let chair = new Chair();
    window.createChair = function (posX, posY) {
        let chair = new Chair(posX, posY);
        chairs.push(chair);
    };

    window.showChairs = function () {
        console.log(chairs);
    };

});

