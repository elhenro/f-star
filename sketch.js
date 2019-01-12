let chairs = [];
window.obstacles = [];

window.updateObstacle = function (id, x, y) {
    window.obstacles.forEach(function (obstacle, i) {
        // if id matches
        if (obstacle[0] === id) {
            // update x and y value for this id
            this.window.obstacles[i][1] = x;
            this.window.obstacles[i][2] = y;
        }
    });
};

$(document).ready(function () {
    window.go = function (index, coords, finalRotationAngle = 0) {
        let chairPos = chairs[index].getLocationOnGrid(chairs[index].chair.position);

        let end = [coords[0], coords[1]];
        let mockMap = getRoute(chairPos, end);

        console.log('Path', mockMap);
        console.log("planned route from ", mockMap[0], " to ", mockMap[mockMap.length - 1]);

        if (chairs[index].chair.debug) {
            console.log('Chair ' + index + ' los gehts!');
            console.log('Path for ', chairs[index], " - ", mockMap);
        }

        chairs[index].resetStepIndex();
        chairs[index].followPath(mockMap, finalRotationAngle);
    };

    //window.chair = new Chair();
    window.createChair = function (posX, posY) {
        let chair = new Chair(posX, posY);

        chairs.push(chair);

        addObstacle(chair.getId(), posX, posY);

        if (chair.debug) console.log('obstacles', window.obstacles);
    };

    window.showChairs = function () {
        console.log(chairs);
    };

    window.pathTo = function (posX, posY) {
        let path = pathTo([posX, posY]);
        console.log('Path', path);
    };

    function addObstacle(id, x, y) {
        window.obstacles = window.obstacles.concat([[id, x, y]]);
    }

    // TESTING for path finding, rotating, collision
    window.createChair(100, 100);
    window.createChair(100, 500);
    window.createChair(500, 500);
    window.createChair(500, 100);

/*    go(0, [1, 3]);
    go(1, [2, 3]);
    go(2, [4, 3]);
    go(3, [5, 3]);*/
});
