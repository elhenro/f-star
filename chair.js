class Chair {
    constructor(posX, posY){
        console.log('Chair created');
        return Bodies.rectangle(posX, posY, 20, 20);
    }

    move(direction, timeout = 50){
        let loc = getLocationOnGrid(box.position.x, box.position.y);

        adjustAngle(direction);

        targetTile = getNeighbourTile(loc, direction);
        //console.log("tile: ", loc, " neighbour: ", targetTile)

        if (direction == "up"){
            driveDirectionY = -1
        }
        if (direction == "down"){
            driveDirectionY = 1
        }
        if (direction == "right"){
            driveDirectionX = 1
        }
        if (direction == "left"){
            driveDirectionX = -1
        }
        driveInterval = setInterval(driveIfNotArrived, timeout);
    }
}