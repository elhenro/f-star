class Chair {
    // Creates a new chair
    constructor(posX = 0, posY = 0) {
        console.log('Chair created');
        this.chair = Bodies.rectangle(posX, posY, 20, 20);

        this.controller = {
            path: [],
            rotationDirection: "",
            wantedAngularRotation: 0,
            rotationSpeed: -0.005,
            driveReady: false,
            rotationReady: true,
            stepIndex: 0,
            moveSpeed: 1,
            timeout: 50,
            forceX: 0,
            forceY: 0,
            rotationInterval: null,
        };
    }

    followPath(path) {
        
        this.controller.path = path;
        //console.log(this.controller);
        for (let step of path) {
            if (this.isNeighbour(step)) {
                let direction = this.whereToMove(step); 

                this.adjustAngle(direction)

            }
        }
    }

    isNeighbour(step){
        // TODO : 3
        // if step.x == + - 1
        let t = true;
        return t;
    }

    // Console logs the chair object
    logYourself() {
        console.log(this.chair);
    }

    // Returns the grid cell for a x y position
    getLocationOnGrid(x, y) {
        let xVal = Math.round(x / 10);
        let yVal = Math.round(y / 10);
        return [xVal, yVal];
    }


    adjustAngle(direction) {
        let pi = Math.PI;
        console.log("started rotating until ", direction)
        let wag;
        if (direction === "up") {
            wag = 0
        } else
        if (direction === "down") {
            wag = (pi)
        } else
        if (direction === "right") {
            wag = (pi * 0.5)
        } else
        if (direction === "left") {
            wag = -(pi * 0.5)
        } else
        {
            wag = 0;
        }

        this.controller.wantedAngularRotation = wag;
        
        this.controller.rotationInterval = setInterval(this.rotateIfNotArrived, 50);
    }

    rotateIfNotArrived() {
        console.log(this.controller);

        let rotationSpeed = this.controller.rotationSpeed;
        
        let box = this.chair;

        let angle = Math.round(box.chair.angle * 10) / 10

        let wantedAngle = Math.round(this.controller.wantedAngularRotation * 10) / 10

        let arrived = (angle === wantedAngle)

        console.log("rotation comparing ", angle, " and ", wantedAngle, " : ", arrived)

        if (arrived === false) {
                //TODO also implement check for readyToRotate here

            this.controller.driveReady = false;
            this.controller.rotationReady = true;

            console.log("still rotating..", angle)

            if ((Math.round(box.chair.angularVelocity * 10) / 10) === 0) {

                Body.setAngularVelocity(box, rotationSpeed)
            }

        } else if (arrived === true) {

            console.log("adjused rotation successfully: ", angle, " ", currentRotationDirection)

            this.controller.driveReady = true;
            this.controller.rotationReady = false;

            // stop spinning



            // start move interval
            Body.setAngularVelocity( box, 0);

            this.stop(box);

            moveReadyInterval = setInterval(moveOnPathIfNextStepReady, /*50*/ 300)


            clearInterval(this.controller.rotationInterval); // function stops itslef
        }

        // spin back if at max rotation
        if (angle > pi) {
            rotationSpeed = -0.01
        }
        if (angle < -(pi)) {
            rotationSpeed = 0.01
        }
    }
    
    moveOnPathIfNextStepReady(){
        let actor = this.chair;

        readyToMove = this.controller.driveReady;
        
        stepIndex = this.controller.stepIndex;
        path = this.controller.path;

        if(readyToMove){
            readyToMove = false;

            let nextTarget = path[ stepIndex ];

            let direction = this.whereToMove( nextTarget );

            move(direction);

            stepIndex ++
        }

        if(this.isArrived(loc, nextTarget)){
            readyToMove = true
            //console.log("arrived at ", nexTarget,"! :)")
        }

        if(this.isArrived(path[(path.length - 1)])){
            alert("Juhu! I foudn the way, all by myself :)");
            console.log("arrived at final location ! <3")
            clearInterval(moveReadyInterval)
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

    // Moves the chair up, right, down or left
    move (direction) {

        speed = this.controller.moveSpeed;
        //timeout = this.controller.timeout; // for actor to stop after a maximum of time with no "response"

        let loc = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);

        let targetTile = this.getNeighbourTile(loc, direction);

        driveDirectionX = this.controller.forceX;
        driveDirectionY = this.controller.forceY;

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

    // check if actor has arrived ar target coordinates like: [position.x, position.y]
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