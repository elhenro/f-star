let chairs = [];
window.obstacles = [];

window.updateObstacle = function(id,x,y){
    window.obstacles.forEach(function (obstacle, i) {
        // if id matches
        if(obstacle[0] === id){
            // update x and y value for this id
            this.window.obstacles[i][1] = x;
            this.window.obstacles[i][2] = y
        }
    });
}

$(document).ready(function () {
    window.go = function (index) {
        let chairPos = chairs[index].getLocationOnGrid(chairs[index].chair.position);
        //let mockMap = getRoute(chairPos);

        let p = [5,20]
        let mockMap = getRoute(chairPos, p)

        console.log(mockMap)
        console.log("planned route from ", mockMap[0]," to ", mockMap[mockMap.length-1])

        if(chairs[index].chair.debug){
            console.log('Chair ' + index + ' los gehts!');
            console.log('Path for ', chairs[index], " - ", mockMap);
        }

        chairs[index].followPath(mockMap);

        // for testing
        //let path = [[19,20],[18,20],[17,20],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20],[7,20],[6,20]];
        //chairs[index].followPath(path);
    };

    window.chair = new Chair();
    window.createChair = function (posX, posY) {
        let chair = new Chair(posX, posY);

        chairs.push(chair);
        
        addObstacle(chair.getId(), posX, posY);

        if(chair.debug){
            console.log(chair.getId())
            console.log(window.obstacles)
        }
    };

    window.showChairs = function () {
        console.log(chairs);
    };

    window.pathTo = function (posX, posY) {
        // todo: (2.) get path from aframe
        let path = pathTo([posX, posY])
        console.log(path)
    }

    // TESTING for collision:
        //  box 1 drives left to collide with box 2
    window.createChair(100, 200)
    window.createChair(200, 200)
    go(1);

    function addObstacle(id, x,y){
        window.obstacles = window.obstacles.concat([[id,x,y]]);
    }
});
