class Chair {
    followPath(path){
        for (step of path){
            if (isNeighbour(step)){
                // TODO letse go...
        }
    }

    // Creates a new chair
    constructor(posX = 0, posY = 0) {
        console.log('Chair created');
        this.chair = Bodies.rectangle(posX, posY, 20, 20);
    }

    // Console logs the chair object
    logYourself() {
        console.log(this.chair);
    }

    // Moves the chair up, right, down or left
    move(direction, speed = 1, timeout = 50) {
        let loc = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);

        let targetTile = this.getNeighbourTile(loc, direction);

        let driveDirectionX = 0;
        let driveDirectionY = 0;
        if (direction === "up") {
            driveDirectionY = -1
        }
        if (direction === "down") {
            driveDirectionY = 1
        }
        if (direction === "right") {
            driveDirectionX = 1
        }
        if (direction === "left") {
            driveDirectionX = -1
        }

        let self = this;
        Events.on(engine, 'afterUpdate', function () {
            Body.setVelocity(self.chair, {x: driveDirectionX * speed, y: driveDirectionY * speed});
        });
    }

    // Returns the grid cell for a x y position
    getLocationOnGrid(x, y) {
        let xVal = Math.round(x / 10);
        let yVal = Math.round(y / 10);
        return [xVal, yVal];
    }


    adjustAngle(direction) {
        let rotationInterval;
        let currentRotationDirection;
        let wantedAngularRotation;
        let pi = Math.PI;

        //console.log("started rotating until ", direction)

        if (direction === "up") {
            wantedAngularRotation = 0
        }
        if (direction === "down") {
            wantedAngularRotation = (pi)
        }
        if (direction === "right") {
            wantedAngularRotation = (pi * 0.5)
        }
        if (direction === "left") {
            wantedAngularRotation = -(pi * 0.5)
        }

        currentRotationDirection = direction;
        rotationInterval = setInterval(this.rotateIfNotArrived, 50);
    }


    rotateIfNotArrived() {
        let rotationSpeed = -0.005;
        let box = boxes[0];
        //let angle = precise(box.angle)
        let angle = Math.round(box.angle * 10) / 10
        //let wantedAngle = precise(wantedAngularRotation)
        let wantedAngle = Math.round(wantedAngularRotation * 10) / 10

        let arrived = (angle === wantedAngle)
        console.log("rotation comparing ", angle, " and ", wantedAngle, " : ", arrived)

        if (arrived === false) {

            readyToMove = false;
            //console.log("still rotating..", angle)

            if ((Math.round(box.angularVelocity * 10) / 10) === 0) {
                Body.setAngularVelocity(box, rotationSpeed)
            }

        } else if (arrived === true) {

            console.log("adjused rotation successfully: ", angle, " ", currentRotationDirection)
            readyToMove = true;
            // stop spinning

            // start move interval
            clearInterval(rotationInterval);
            Body.setAngularVelocity(box, 0);

            this.stop(this.chair);

            moveReadyInterval = setInterval(moveOnPathIfNextStepReady, /*50*/ 300)
        }

        // spin back if at max rotation
        if (angle > pi) {
            rotationSpeed = -0.01
        }
        if (angle < -(pi)) {
            rotationSpeed = 0.01
        }
    }

    getNeighbourTile(coordinates, direction) {
        let stepSize = 1;
        if (direction === "up") {
            return [coordinates[0], (coordinates[1] - stepSize)]
        }
        if (direction === "down") {
            return [coordinates[0], (coordinates[1] + stepSize)]
        }
        if (direction === "right") {
            return [(coordinates[0] + stepSize), coordinates[1]]
        }
        if (direction === "left") {
            return [(coordinates[0] - stepSize), coordinates[1]]
        }
        /*
        if (direction !== "up" || direction !== "left" || direction !== "right" || direction !== "down"){
            console.log("error - direction ", direction, " not found")
        }*/
    }

    driveIfNotArrived(driveDirectionX = 0, driveDirectionY = 0) {
        let loc = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);

        let arrived;
        /*if (driveDirectionY !== 0){
            arrived = checkIfArrivedAtHeight(loc, targetTile)
        } else if (driveDirectionX !== 0){
            arrived = checkIfArrivedAtWidth(loc, targetTile)
        }*/
        if (!arrived) {
            this.drive(driveDirectionX, driveDirectionY);
        } else {
            if (arrived) {
                this.stop(this.chair);
                clearInterval(driveInterval);
                driveDirectionX = 0;
                driveDirectionY = 0;
            }
        }
    }

    isArrived(target){
        let chairGridPos = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);
        console.log(chairGridPos, target);
        return (chairGridPos[0] === target[0] && chairGridPos[1] === target[1]);
    }

    // Returns "up", "right", "down" or "left"
    // depending on the direction the chair has
    // to move to arrive at the target location
    whereToMove(target) {
        let direction;
        let chairGridPos = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);

        if (chairGridPos[0] > target[0]) {
            direction = "left";
        } else if (chairGridPos[0] < target[0]) {
            direction = "right";
        } else if (chairGridPos[1] > target[1]) {
            direction = "down"
        } else if (chairGridPos[1] < target[1]) {
            direction = "up"
        }
        return direction;
    }

    // Rotates the chair clock- or counterclockwise
    rotate(clockwise = true, speed = 1) {
        let self = this;
        let rotation = 0.05 * speed;
        if (!clockwise) {
            rotation = -0.05 * speed;
        }

        Events.on(engine, 'afterUpdate', function () {
            Body.rotate(self.chair, rotation);
        });
    }

    // Stops the chair movement and rotation
    stop() {
        console.log('stopping chair');
        this.move('up', 0);
        this.rotate(true, 0);
    }

    // Gives the chair a velocity
    drive(x, y, speed = 1) {
        Body.setVelocity(this.chair, {x: x * speed, y: y * speed});
    }


}