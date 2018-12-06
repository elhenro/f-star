class Chair {
    // Creates a new chair
    constructor(posX = 0, posY = 0) {
        this.simulation = new Simulation();
        this.chair = this.simulation.createChair(posX, posY);
        if(this.debug){
            console.log(this.chair);
        }

        let self = this;

        // enable / disable console logging for more information
        this.debug = false;
        
        this.controller = {
            path: [], // comes from bottom of sketch.js
            direction: "",
            wantedAngularRotation: null,
            initialSpeed: 0.1,
            rotationSpeed: -0.1,
            driveReady: false,
            rotationReady: true,
            stepIndex: 0,
            moveSpeed: 0.6,
            timeout: 50,
            forceX: 0,
            forceY: 0,
            rotationIntervalTime: 20,
            moveIntervalTime: 10,
            rotationIntervalID: null,
            moveIntervalID: null,
            rotationInterval: function () {
                let actualAngle = (Math.round(self.chair.angle * 10) / 10);
                let wantedAngle = (Math.round(self.controller.wantedAngularRotation * 10) / 10);

                let arrivedAtAngle = actualAngle === wantedAngle;

                if (arrivedAtAngle === false && self.controller.rotationReady) {

                    self.controller.driveReady = false;
                    clearInterval(self.controller.moveIntervalID);

                    if ((Math.round(self.chair.angularVelocity * 10) / 10) === 0) {
                        self.simulation.applyForce(self.chair, 'Rotation', null, self.controller.rotationSpeed)
                    }
                } else if (arrivedAtAngle === true) {
                    //console.log("adjusted rotation successfully: ", self.chair.angle, " ", self.controller.wantedAngularRotation)

                    self.controller.driveReady = true;
                    self.controller.rotationReady = false;

                    // stop spinning
                    self.stop();

                    // interval clears itself
                    clearInterval(self.controller.rotationIntervalID);

                    // set movement interval
                    self.controller.moveIntervalID = setInterval(self.controller.moveInterval, self.controller.moveIntervalTime)
                }
                // spin back if at max rotation
                if (self.chair.angle > (Math.PI * 2)) {
                    self.controller.rotationSpeed = -(self.controller.initialSpeed);
                }
                if (self.chair.angle < -(Math.PI * 2)) {
                    self.controller.rotationSpeed = self.controller.initialSpeed;
                }
            },
            moveInterval: function () {
                let nextTarget = self.controller.path[self.controller.stepIndex];

                // debug
                //console.log("NEXT TARGET ", nextTarget, " current position: ", (Math.round(self.chair.position.x) / 10), (Math.round(self.chair.position.y) / 10 ));

                // prevent collision
                if (self.stepBlockedByObstacle(nextTarget, this.window.obstacles)){

                    //self.getNewWay()

                    self.stop()
                    return
                }

                if (self.controller.driveReady === false) {
                    if(this.debug){
                        console.log("not ready to move.");
                    }
                    self.stop();
                }

                // if is ready to move
                if ((self.controller.driveReady === true) && (nextTarget != undefined)) {
                    //self.controller.driveReady = false;

                    self.move(self.controller.direction);
                }

                // if is arrived at current target
                //console.log("checking if arrived at:", nextTarget, " current: ", self.chair.position)
                if (self.isArrived(nextTarget)) {


                    self.controller.stepIndex++;
                    if(this.debug){

                        console.log("X X X X X X X --- arrived at ", nextTarget, "! :) ---  X X X X X X X X");
                        console.log("new target is: ", self.controller.path[self.controller.stepIndex]);
                    }

                    self.controller.driveReady = false;
                    self.controller.rotationReady = true;

                    clearInterval(self.moveIntervalID);
                    //Body.setVelocity(self.chair, {x: 0, y: 0});
                    self.stop();

                    // NEXT
                    self.followPath(self.controller.path);
                }

                // if is arrived at last step
                if (self.isArrived(self.controller.path[(self.controller.path.length - 1)])) {
                    //alert("Juhu! I foudn the way, all by myself :)");
                    if(this.debug){
                        console.log("arrived at final location ! <3");
                    }

                    // interval clears itself
                    clearInterval(self.controller.moveIntervalID);

                    self.controller.driveReady = false;
                    self.controller.rotationReady = true;
                }

                if (nextTarget == undefined) {
                    self.errorState = true;
                    self.errorMsg = "error - no next target defined";
                    self.stop();
                    console.log(self.errorMsg)
                }
            },
            errorState: false,
            errorMsg: "",
        };
    }

    followPath(path) {
        if (!this.controller.errorState) {
            this.controller.path = path;

            //target is neighbour tile
            if (this.isNeighbour(path[this.controller.stepIndex])) {
                if(this.debug){
                    console.log("getting next direction for step number [", this.controller.stepIndex, "] : ", path[this.controller.stepIndex])
                }

                if (this.whereToMove(path[this.controller.stepIndex]) != "err"){
                    this.controller.direction = this.whereToMove(path[this.controller.stepIndex]);
                } else {
                    console.log("!! ERROR: ", this.errorMsg);
                    return
                }

                if(this.debug){
                    console.log("ADJUSTING ANGLE: ", this.controller.direction);
                }
                if (this.adjustAngle === undefined) {
                    this.errorState = true;
                    this.errorMsg = "undefined adjustment angle"
                } else {
                    this.adjustAngle(this.controller.direction);
                }
            } else
            // target is not neighbour tile
            if (this.isNeighbour(path[this.controller.stepIndex]) === false) {
                this.errorState = true;
                this.errorMsg = "warning -- current target out of reach: ", path[this.controller.stepIndex], " position: ", this.chair.position.x, " ", this.chair.position.y;
            }
            // if error was produced
        } else if (this.controller.errorState) {

            this.stop();
            throw new Error(this.controller.errorMsg);
        }
    }

    isNeighbour(step) {
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
    getLocationOnGrid(position) {
        let xVal = Math.round(position.x * 10) / 10;
        let yVal = Math.round(position.y * 10) / 10;
        return [xVal, yVal];
    }


    adjustAngle(direction) {
        let pi = Math.PI;

        //console.log("started rotating until ", direction);

        let wag;
        if (direction === "up") {
            wag = (Math.PI * 0.5)
        } else if (direction === "down") {
            wag = -(Math.PI * 0.5)
        } else if (direction === "right") {
            wag = Math.PI
        } else if (direction === "left") {
            wag = 0
        } else {
            wag = 0;
        }

        if(this.debug){
            console.log("WAG: ", wag);
        }

        this.controller.wantedAngularRotation = wag;

        this.controller.rotationIntervalID = setInterval(this.controller.rotationInterval, this.controller.rotationIntervalTime)
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
    move(direction) {

        if (direction === "up") {
            this.controller.forceY = -1;
            this.controller.forceX = 0;
        }
        if (direction === "down") {
            this.controller.forceY = 1;
            this.controller.forceX = 0;
        }
        if (direction === "right") {
            this.controller.forceX = 1;
            this.controller.forceY = 0;
        }
        if (direction === "left") {
            this.controller.forceX = -1;
            this.controller.forceY = 0;
        }

        this.simulation.applyForce(this.chair, 'Straight', {
            x: this.controller.forceX,
            y: this.controller.forceY
        }, this.controller.moveSpeed);
        /*     Body.setVelocity(this.chair, {
                 x: this.controller.forceX * this.controller.moveSpeed,
                 y: this.controller.forceY * this.controller.moveSpeed
             });*/

    }

    // check if actor has arrived ar target coordinates like: [position.x, position.y]
    isArrived(target) {
        if (typeof target === 'undefined') {
            console.log("warning: target is not defined: ", target);
            this.controller.errorState = true;
            return;
        }
        //this.controller.stepIndex ++

        let chairGridPos = this.getLocationOnGrid(this.simulation.getPosition(this.chair));
        //console.log(chairGridPos, target);
        //console.log("Arrivalcheck: comparing: ", Math.round(chairGridPos[0]), " and ", (target[0] * 10), " , also ", Math.round(chairGridPos[1]), " and ", (target[1] * 10));
        //console.log("arrival check returns: ", ((Math.round(chairGridPos[0]) === (target[0] * 10) )&&( Math.round(chairGridPos[1]) === (target[1] * 10))))
        return ((Math.round(chairGridPos[0]) === (target[0] * 10)) && (Math.round(chairGridPos[1]) === (target[1] * 10)));
    }

    // Returns "up", "right", "down" or "left"
    // depending on the direction the chair has
    // to move to arrive at the target location
    whereToMove(target) {
        if(this.debug){
            console.log("called: whereToMove(", target, ")");
        }

        if (!target) {
            this.errorState = true;
            this.errorMsg = "no next target ( or arrived ? ),  chair ID: " + this.chair.id 
            this.stop();
            //this.followPath(this.controller.path);
            return "err"
        }
        
        if(this.debug){
            console.log("current position: ", this.getLocationOnGrid(this.simulation.getPosition(this.chair)));
        }



        let chairGridPos = this.getLocationOnGrid(this.simulation.getPosition(this.chair));

        let xPos = Math.round(chairGridPos[0]);
        let yPos = Math.round(chairGridPos[1]);
        let xTarget = target[0] * 10;
        let yTarget = target[1] * 10;

        if (xPos === xTarget) {
            if (yPos > yTarget) {
                return "up";
            } else if (yPos < yTarget) {
                return "down";
            } else {
                this.errorState = true;
                this.errorMsg = ("failed finding direction with: " + yPos + " and " + yTarget);
            }
        } else if (yPos === yTarget) {
            if (xPos > xTarget) {
                return "left";
            } else if (xPos < xTarget) {
                return "right";
            } else {
                this.errorState = true;
                this.errorMsg = ("failed getting direction with position:" + xPos + " " + yPos + " and target: " + xTarget + " " + yTarget);
            }
        }
    }

    // Stops the chair movement and rotation
    stop() {
        if(this.debug){
            console.log('stopping chair');
        }
        //this.controller.driveReady = false;
        //this.controller.rotationReady = false;

        clearInterval(this.controller.moveIntervalID);
        clearInterval(this.controller.rotationIntervalID);

        // nur zum testen in simulation
        this.simulation.applyForce(this.chair, 'Straight', {x: 0, y: 0}, this.controller.moveSpeed);
        this.simulation.applyForce(this.chair, 'Rotation', null, 0);
    }

    stepBlockedByObstacle(step, obstacles){
        for (let obstacle of obstacles) {
            if(obstacle[0] == (step[0] * 10) && obstacle[1] == (step[1] * 10)){
                //if(this.debug){
                    console.log(step, " blocked by obstacle: ", obstacle)
                //}
                return true
            }
        }
        return false
    }

    getNewWay() {
        
        // todo: re-call followPath(), because actor was stop() 'ed before 
    }
}
