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
            initalSpeed: 0.1,
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
            rotationInterval: function() {
                //console.log(self.controller)

                let actualAngle = (Math.round(self.chair.angle * 10) / 10);
                let wantedAngle = (Math.round(self.controller.wantedAngularRotation * 10) / 10 );

                let arrivedAtAngle = actualAngle === wantedAngle;

                //console.log("rotation comparing ", actualAngle, " and ", wantedAngle, " : ", arrivedAtAngle)

                if (arrivedAtAngle === false && self.controller.rotationReady) {

                    self.controller.driveReady = false;
                    clearInterval(self.controller.moveIntervalID);
                    //self.controller.rotationReady = true;

                    //console.log("still rotating..", wantedAngle)
                    if ((Math.round( self.chair.angularVelocity * 10) / 10) === 0) {
                        Body.setAngularVelocity(self.chair, self.controller.rotationSpeed)
                    }
                } else 
                if (arrivedAtAngle === true) {
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
                    self.controller.rotationSpeed = -(self.controller.initalSpeed);
                }
                if (self.chair.angle < -(Math.PI * 2)) {
                    self.controller.rotationSpeed = self.controller.initalSpeed;
                }
            },
            moveInterval: function() {
                let nextTarget = self.controller.path[ self.controller.stepIndex ];

                // debug
                //console.log("NEXT TARGET ", nextTarget, " current position: ", (Math.round(self.chair.position.x) / 10), (Math.round(self.chair.position.y) / 10 ));

                if(self.controller.driveReady === false){
                    console.log("not ready to move.")
                    self.stop()
                }

                // if is ready to move
                if((self.controller.driveReady === true) && (nextTarget != undefined)) {
                    //self.controller.driveReady = false;

                    self.move(self.controller.direction);
                }

                // if is arrived at current target
                //console.log("checking if arrived at:", nextTarget, " current: ", self.chair.position)
                if(self.isArrived(nextTarget)){

                    console.log("X X X X X X X --- arrived at ", nextTarget,"! :) ---  X X X X X X X X")

                    self.controller.stepIndex ++
                    console.log("new target is: ", self.controller.path[self.controller.stepIndex])

                    self.controller.driveReady = false
                    self.controller.rotationReady = true

                    clearInterval(self.moveIntervalID);
                    //Body.setVelocity(self.chair, {x: 0, y: 0});
                    self.stop()

                    // NEXT
                    self.followPath(self.controller.path);
                }

                // if is arrived at last step
                if(self.isArrived(self.controller.path[(self.controller.path.length - 1)])){
                    alert("Juhu! I foudn the way, all by myself :)");
                    console.log("arrived at final location ! <3")

                    // interval clears itself
                    clearInterval(self.controller.moveIntervalID)

                    self.controller.driveReady = false
                    self.controller.rotationReady = true
                } 

                if (nextTarget == undefined){
                    self.errorState = true;
                    self.errorMsg = "error - no next target defined";
                    self.stop()
                    console.log(self.errorMsg)
                }
            },
            errorState: false,
            errorMsg: "",
        };
    }

    followPath(path) {
        if (this.controller.errorState === false){ 
            this.controller.path = path;

            //target is neighbour tile
            if(this.isNeighbour(path[this.controller.stepIndex])){
                console.log("getting next direction for step number [", this.controller.stepIndex,"] : ", path[this.controller.stepIndex])
                this.controller.direction = this.whereToMove(path[this.controller.stepIndex]);

                console.log("ADJUSTING ANGLE: ", this.controller.direction);
                if(this.adjustAngle === undefined){
                    this.errorState = true;
                    this.errorMsg = "undefined adjustment angle"
                } else {
                    this.adjustAngle(this.controller.direction);
                }
            }
            else 
            // target is not neighbour tile
            if(this.isNeighbour( path[this.controller.stepIndex] ) === false) {
                this.errorState = true;
                this.errorMsg = "warning -- current target out of reach: ", path[this.controller.stepIndex], " position: ", this.chair.position.x, " ", this.chair.position.y;
            } 
        // if error was produced
        } else if ( this.controller.errorState === true){

            this.stop();
            throw new Error(this.controller.errorMsg);
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
        let xVal = Math.round(x * 10) / 10;
        let yVal = Math.round(y * 10) / 10;
        return [xVal, yVal];
    }


    adjustAngle(direction) {
        let pi = Math.PI;
        
        //console.log("started rotating until ", direction);
        
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

        // DAS WAR DAS PROBLEM LöL !!!!!
        // deswegen ist er einfach weiter gefahren, weil unsere stop function ihn dann nie stoppt.... 
        //let self = this;
        //Events.on(engine, 'afterUpdate', function () {
            //Body.setVelocity(self.chair, {x: self.controller.forceX * self.controller.moveSpeed, y: self.controller.forceY * self.controller.moveSpeed});
        //});

        Body.setVelocity(this.chair, {x: this.controller.forceX * this.controller.moveSpeed, y: this.controller.forceY * this.controller.moveSpeed});

    }

    // check if actor has arrived ar target coordinates like: [position.x, position.y]
    isArrived(target){
        if (target == undefined) {
            console.log("warning: target is not defined: ", target);
            this.controller.errorState = true;

            return;
        }
        //this.controller.stepIndex ++
        
        let chairGridPos = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);
        //console.log(chairGridPos, target);
        //console.log("Arrivalcheck: comparing: ", Math.round(chairGridPos[0]), " and ", (target[0] * 10), " , also ", Math.round(chairGridPos[1]), " and ", (target[1] * 10));
        //console.log("arrival check returns: ", ((Math.round(chairGridPos[0]) === (target[0] * 10) )&&( Math.round(chairGridPos[1]) === (target[1] * 10))))
        return ((Math.round(chairGridPos[0]) === (target[0] * 10) )&&( Math.round(chairGridPos[1]) === (target[1] * 10)));
    }

    // Returns "up", "right", "down" or "left"
    // depending on the direction the chair has
    // to move to arrive at the target location
    whereToMove(target) {
        console.log("called: whereToMove(", target,")");
        if (target === undefined){
            this.stop();
            this.errorState = true;
            this.errorMsg = "undefined next target"
        }
        console.log("current position: ", this.getLocationOnGrid(this.chair.position.x, this.chair.position.y));
        let direction;
        let chairGridPos = this.getLocationOnGrid(this.chair.position.x, this.chair.position.y);
        
        let xPos = Math.round(chairGridPos[0]);
        let yPos = Math.round(chairGridPos[1]);
        let xTarget = target[0] * 10;
        let yTarget = target[1] * 10; 

        console.log("?? ", xPos, " = ", xTarget)
        if (xPos == xTarget){
            if (yPos > yTarget){
                return "up";
            } else if (yPos < yTarget){
                return "down";
            } /*else {
                this.errorState = true;
                this.errorMsg = ("failed finding direction with: " + yPos + " and " + yTarget);
            }*/
        } else
        console.log("?? ", yPos, " = ", yTarget)
        if (yPos == yTarget){
            if (xPos > xTarget){
                return "left";
            } else 
            if (xPos < xTarget){
                return "right";
            } /*else {
                this.errorState = true;
                this.errorMsg = ("failed finding direction with: " + xPos + " and " + xTarget);
                return this.errorMsg
            }*/
        } /*else 
        if (xPos > xTarget) {
            return "left";
        } else 
        if (xPos < xTarget){
            return "right";
        } else
        if ( yPos > yTarget){
            return "up";
        } else
        if (yPos < yTarget){
            return "down";
        }*/

        {
            this.errorState = true;
            this.errorMsg = ("failed getting direction with position:"+ xPos + " " + yPos + " and target: " + xTarget + " " + yTarget);
        }

        /*
        if (xPos > xTarget) {
            // problem: up also returns left
            direction = "left";
        } else 
        if (xPos < xTarget) {
            direction = "right";
        } else 
        if (chairGridPos[1] > target[1]) {
            direction = "up"
        } else 
        if (chairGridPos[1] < target[1]) {
            direction = "down"
        }*/
        //return direction;
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
        //this.controller.driveReady = false;
        //this.controller.rotationReady = false;
        
        clearInterval(this.controller.moveIntervalID);
        clearInterval(this.controller.rotationIntervalID);

        Body.setVelocity(this.chair, {x: 0, y: 0});
        Body.setAngularVelocity(this.chair, 0);
    }
}
