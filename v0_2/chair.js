class Chair {
    // Creates a new chair
    constructor(posX = 0, posY = 0) {
        console.log('Chair created');
        this.chair = Bodies.rectangle(posX, posY, 20, 20);
        let self = this;
        this.controller = {
            path: [], // comes from bottom of sketch.js
            direction: "",
            wantedAngularRotation: null,
            initalSpeed: 0.02,
            rotationSpeed: -0.03,
            driveReady: false,
            rotationReady: true,
            stepIndex: 0,
            moveSpeed: 0.2,
            timeout: 50,
            forceX: 0,
            forceY: 0,
            rotationIntervalTime: 30,
            moveIntervalTime: 20,
            rotationInterval: function() {
                //console.log(self.controller)

                let actualAngle = (Math.round(self.chair.angle * 10) / 10);
                let wantedAngle = (Math.round(self.controller.wantedAngularRotation * 10) / 10 );

                let arrivedAtAngle = actualAngle === wantedAngle;

                console.log("rotation comparing ", actualAngle, " and ", wantedAngle, " : ", arrivedAtAngle)

                if (arrivedAtAngle === false && self.controller.rotationReady) {

                    self.controller.driveReady = false;
                    //self.controller.rotationReady = true;

                    //console.log("still rotating..", wantedAngle)

                    if ((Math.round( self.chair.angularVelocity * 10) / 10) === 0) {
                        Body.setAngularVelocity(self.chair, self.controller.rotationSpeed)
                    }
                } else if (arrivedAtAngle === true) {
                    //console.log("ANGEL: ", actualAngle);
                    //console.log("WANTEDANGLE: ", wantedAngle)

                    //console.log("adjusted rotation successfully: ", self.chair.angle, " ", self.controller.wantedAngularRotation)

                    self.controller.driveReady = true;
                    self.controller.rotationReady = false;

                    // stop spinning
                    self.stop();

                    // interval clears itself
                    clearInterval(self.controller.rotationInterval);

                    // set movement interval
                    setInterval(self.controller.moveInterval, self.controller.moveIntervalTime)
                }
                // spin back if at max rotation
                if (self.chair.angle > (Math.PI * 2)) {
                    self.controller.rotationSpeed = -(self.controller.initalSpeed);
                }
                if (self.chair.angle < -(Math.PI * 2)) {
                    self.controller.rotationSpeed = self.controller.initalSpeed;
                }
            },
            moveInterval: function() {
                let nextTarget = self.controller.path[ self.controller.stepIndex ];

                // debug
                console.log("NEXT TARGET ", nextTarget, " current position: ", (Math.round(self.chair.position.x) / 10), (Math.round(self.chair.position.y) / 10 ));

                if(self.controller.driveReady === false){
                    console.log("not ready to move.")
                }

                // if is ready to move
                if((self.controller.driveReady === true) && (nextTarget != undefined)) {
                    //self.controller.driveReady = false;

                    self.move(self.controller.direction);
                }

                // if is arrived at current target
                if(self.isArrived(nextTarget)){
                    console.log("arrived at ", nextTarget,"! :)")

                    self.controller.stepIndex ++

                    self.controller.driveReady = false
                    self.controller.rotationReady = false
                    self.stop()
                    //this.followPath(self.controller.path);
                }

                // if is arrived at last step
                if(self.isArrived(self.controller.path[(self.controller.path.length - 1)])){
                    alert("Juhu! I foudn the way, all by myself :)");
                    console.log("arrived at final location ! <3")

                    // interval clears itself
                    clearInterval(self.controller.moveInterval)

                    self.controller.driveReady = false
                    self.controller.rotationReady = true
                } 

                if (nextTarget == undefined){
                    console.log("warning - no next target defined")
                }
            },
            errorState: false,
        };
    }

    followPath(path) {
        if (this.controller.errorState === false){ 
            this.controller.path = path;

            //target is neighbour tile
            if(this.isNeighbour(path[this.controller.stepIndex])){
                this.controller.direction = this.whereToMove(path[this.controller.stepIndex]);

                //console.log("ADJUSTING ANGLE: ", this.controller.direction);
                this.adjustAngle(this.controller.direction);
            }
            else 
            // target is not neighbour tile
            if(this.isNeighbour( path[this.controller.stepIndex] ) === false) {
                    console.log("warning -- current target out of reach: ", path[this.controller.stepIndex], " position: ", this.chair.position.x, " ", this.chair.position.y)
            } 
        // if error was produced
        } else if ( this.controller.errorState === true){
           console.log("ERROR - stopped following path");
            this.stop();
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
        
        console.log("started rotating until ", direction);
        
        let wag;
        if (direction === "up") {
            wag = 0
        } else
        if (direction === "down") {
            wag = (Math.PI)
        } else
        if (direction === "right") {
            wag = (Math.PI * 0.5)
        } else
        if (direction === "left") {
            wag = - (Math.PI * 0.5)
        } else
        {
            wag = 0;
        }

        console.log("WAG: ", wag)
        this.controller.wantedAngularRotation = wag;

        //this.controller.rotationInterval = setInterval(this.rotateIfNotArrived, this.controller.rotationIntervalTime);

        setInterval(this.controller.rotationInterval, this.controller.rotationIntervalTime)

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
    }

    // Moves the chair up, right, down or left
    move (direction) {

        if (direction === "up") {
            this.controller.forceY = -1
            this.controller.forceX = 0
        }
        if (direction === "down") {
            this.controller.forceY = 1
            this.controller.forceX = 0
        }
        if (direction === "right") {
            this.controller.forceX = 1
            this.controller.forceY = 0
        }
        if (direction === "left") {
            this.controller.forceX = -1
            this.controller.forceY = 0
        }

        let self = this;
        Events.on(engine, 'afterUpdate', function () {
            Body.setVelocity(self.chair, {x: self.controller.forceX * self.controller.moveSpeed, y: self.controller.forceY * self.controller.moveSpeed});
        });
    }

    // check if actor has arrived ar target coordinates like: [position.x, position.y]
    isArrived(target){
        if (target == undefined) {
            console.log("warning: target is not defined: ", target);
            this.controller.errorState = true;

            return; // = break
        }

        //this.controller.stepIndex ++
        
        let chairGridPos = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);
        //console.log(chairGridPos, target);

        //console.log("Arrivalcheck: comparing: ", chairGridPos[0], " and ", target[0], " , also ", chairGridPos[1], " and ", target[1]);
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
            direction = "up"
        } else if (chairGridPos[1] < target[1]) {
            direction = "down"
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

        console.log(this.chair.angle);
        //this.move('down', 0);
        //this.rotate(true, 0);
        
        clearInterval(this.controller.moveInterval);
        clearInterval(this.controller.rotationInterval);

        Body.setVelocity(this.chair, {x: 0, y: 0});
        Body.setAngularVelocity(this.chair, 0);
    }

    // Gives the chair a velocity
    drive(x, y, speed = 1) {
        Body.setVelocity(this.chair, {x: x * speed, y: y * speed});
    }


}
