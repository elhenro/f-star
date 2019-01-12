class Chair {
    // Creates a new chair
    constructor(posX = 0, posY = 0) {
        this.simulation = new Simulation();
        this.chair = this.simulation.createChair(posX, posY);
        if (this.debug) {
            console.log(this.chair);
        }

        let self = this;

        // enable / disable console logging for more information
        this.debug = false;

        this.controller = {
            path: [], // comes from sketch.js
            finalRotationAngle: null,
            direction: "",
            wantedAngularRotation: null,
            initialSpeed: 0.05,
            rotationSpeed: 0.05,
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
                if (self.controller.rotationReady) {
                    let angleAccuracy = 80;
                    let angleSlowDownRegion = 0.25;

                    let actualAngle = (self.chair.angle % (Math.PI * 2));
                    let actualAngleSoft = (Math.round(self.chair.angle * angleAccuracy) / angleAccuracy);

                    let wantedAngleSoft = (Math.round(self.controller.wantedAngularRotation * angleAccuracy) / angleAccuracy);

                    let arrivedAtAngle = (actualAngleSoft === wantedAngleSoft);

                    // Chair is does not look towards the wanted direction.
                    // Start rotation
                    if (arrivedAtAngle === false) {
                        self.controller.driveReady = false;
                        clearInterval(self.controller.moveIntervalID);

                        let speed = self.controller.initialSpeed;

                        // If chair angle is close to wanted angle, decrease speed
                        if (actualAngle <= (wantedAngleSoft + angleSlowDownRegion) && actualAngle >= (wantedAngleSoft - angleSlowDownRegion)) {
                            speed = speed / 10;
                        }

                        // Start rotating
                        if (actualAngle > wantedAngleSoft) {
                            self.simulation.applyForce(self.chair, 'Rotation', null, -speed);
                        } else if (actualAngle < wantedAngleSoft) {
                            self.simulation.applyForce(self.chair, 'Rotation', null, speed);
                        }

                    } else if (arrivedAtAngle === true) {
                        if (this.debug) console.log("adjusted rotation successfully: ", self.chair.angle, self.controller.wantedAngularRotation);

                        self.controller.driveReady = true;
                        self.controller.rotationReady = false;

                        // stop spinning
                        self.stop();
                        // interval clears itself
                        clearInterval(self.controller.rotationIntervalID);
                        // set movement interval
                        self.controller.moveIntervalID = setInterval(self.controller.moveInterval, self.controller.moveIntervalTime)
                    }
                }
            },
            moveInterval: function () {
                let nextTarget = self.controller.path[self.controller.stepIndex];

                if (this.debug) {
                    console.log("NEXT TARGET ", nextTarget, " current position: ", (Math.round(self.chair.position.x) / 10), (Math.round(self.chair.position.y) / 10));
                }

                // prevent collision todo: does not work
                if (self.stepBlockedByObstacle(nextTarget, this.window.obstacles)) {
                    self.stop();
                    return;
                }

                if (self.controller.driveReady === false) {
                    if (this.debug) {
                        console.log("not ready to move.");
                    }
                    self.stop();
                }

                // if is ready to move
                if ((self.controller.driveReady === true) && (nextTarget != undefined)) {
                    self.move(self.controller.direction);
                }

                // if is arrived at current target
                if (this.debug) console.log("checking if arrived at:", nextTarget, " current: ", self.chair.position)

                if (self.isArrived(nextTarget)) {
                    let position = self.simulation.getPosition(self.chair);
                    self.updateObstaclePosition(self.getId(), position.x, position.y);

                    self.controller.stepIndex++;
                    if (self.debug) {
                        console.log(self.chair.id, "X X X X X X X --- arrived at ", nextTarget, "! :) ---  X X X X X X X X");
                        console.log("new target is: ", self.controller.path[self.controller.stepIndex]);
                    }

                    self.controller.driveReady = false;
                    self.controller.rotationReady = true;

                    clearInterval(self.moveIntervalID);
                    self.stop();

                    // NEXT
                    let currentLoc = self.getLocationOnGrid(self.chair.position);
                    self.controller.path = getRoute(currentLoc, self.controller.path[self.controller.path.length - 1]);
                    self.resetStepIndex();
                    self.followPath(self.controller.path);
                }

                // if is arrived at last step
                if (self.isArrived(self.controller.path[(self.controller.path.length - 1)])) {
                    console.log("arrived at final location! <3");

                    // interval clears itself
                    clearInterval(self.controller.moveIntervalID);

                    self.controller.driveReady = false;
                    self.controller.rotationReady = true;

                    self.controller.wantedAngularRotation = self.controller.finalRotationAngle;
                    if (self.debug) console.log("rotating to final rotation angle", self.controller.finalRotationAngle, self.controller.wantedAngularRotation);
                    self.controller.rotationInterval();
                }

                if (nextTarget == undefined) {
                    self.errorState = true;
                    self.errorMsg = "error - no next target defined";
                    self.stop();
                    console.log(self.errorMsg);
                }
            },
            errorState: false,
            errorMsg: "",
        };
    }

    followPath(path, finalRotationAngle) {
        if (!this.controller.errorState) {
            this.controller.path = path;
            if (typeof finalRotationAngle !== 'undefined') this.controller.finalRotationAngle = finalRotationAngle;

            //target is neighbour tile
            if (this.isNeighbour(path[this.controller.stepIndex])) {
                if (this.debug) {
                    console.log("getting next direction for step number [", this.controller.stepIndex, "] : ", path[this.controller.stepIndex])
                }

                if (this.whereToMove(path[this.controller.stepIndex]) != "err") {
                    this.controller.direction = this.whereToMove(path[this.controller.stepIndex]);
                } else {
                    console.log("!! ERROR: ", this.errorMsg);
                    return
                }

                this.adjustAngle();
            } else
            // target is not neighbour tile
            if (this.isNeighbour(path[this.controller.stepIndex]) === false) {
                this.errorState = true;
                this.errorMsg = "warning -- current target out of reach: " + path[this.controller.stepIndex] + " position: " + this.chair.position.x + " " + this.chair.position.y;
            }
            // if error was produced
        } else if (this.controller.errorState) {

            this.stop();
            throw new Error(this.controller.errorMsg);
        }
    }

    isNeighbour(step) {
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
        let columns = 100;
        let rows = 100;

        let x = Math.round(position.x / columns);
        let y = Math.round(position.y / rows);

        return {x: x, y: y};
    }


    adjustAngle() {
        let wag = Math.atan2(this.chair.position.y - (this.controller.path[this.controller.stepIndex][1] * 100), this.chair.position.x - (this.controller.path[this.controller.stepIndex][0] * 100));

        if (this.debug) console.log(this.chair.id, "Started rotating to: ", wag);

        this.controller.wantedAngularRotation = wag;
        this.controller.rotationIntervalID = setInterval(this.controller.rotationInterval, this.controller.rotationIntervalTime)
    }

    // Accelerates the chair
    move() {
        this.simulation.applyForce(this.chair, 'Straight', {
            x: Math.cos(this.chair.angle - Math.PI),
            y: Math.sin(this.chair.angle - Math.PI)
        }, this.controller.moveSpeed);
    }

    // check if actor has arrived ar target coordinates like: [position.x, position.y]
    isArrived(target) {
        let bufferRadius = 5;

        if (typeof target === 'undefined') {
            console.log("warning: target is not defined: ", target);
            this.controller.errorState = true;
            return;
        }

        let chairPos = this.simulation.getPosition(this.chair);

        let distanceToNextStep = Math.sqrt(Math.pow(chairPos.x - (target[0] * 100), 2) + Math.pow(chairPos.y - (target[1] * 100), 2));
        let chairIsArrived = (distanceToNextStep < bufferRadius);
        //let chairIsArrived = (Math.round(chairGridPos.x) === (target[0] * 100)) && (Math.round(chairGridPos.y) === (target[1] * 100));
        if (this.debug) {
            console.log('Chair grid position and target', chairPos, target);
            console.log('Chair is arrived', chairIsArrived);
        }

        return chairIsArrived;
    }

    // Returns "up", "right", "down" or "left"
    // depending on the direction the chair has
    // to move to arrive at the target location
    whereToMove(target) {
        if (this.debug) console.log("called: whereToMove(", target, ")");

        if (!target) {
            this.errorState = true;
            this.errorMsg = "no next target ( or arrived ? ),  chair ID: " + this.chair.id;
            this.stop();
            //this.followPath(this.controller.path);
            return "err";
        }

        if (this.debug) {
            console.log("current position: ", this.getLocationOnGrid(this.simulation.getPosition(this.chair)));
        }

        let chairGridPos = this.getLocationOnGrid(this.simulation.getPosition(this.chair));

        let xPos = chairGridPos.x;
        let yPos = chairGridPos.y;
        let xTarget = target[0];
        let yTarget = target[1];

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
        if (this.debug) {
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

    stepBlockedByObstacle(step, obstacles) {
        for (let obstacle of obstacles) {
            if (obstacle[1] == (step[0] * 10) && obstacle[2] == (step[1] * 10)) {
                //if(this.debug){
                console.log("chairID:", this.getId(), "step:", step, " was blocked by obstacle: ", obstacle);
                //}
                return true
            }
        }
        return false
    }

    getNewWay() {

        // todo: re-call followPath(), because actor was stop() 'ed before 
    }

    getId() {
        return this.chair.id;
    }

    updateObstaclePosition(id, x, y) {
        if (this.debug) {
            console.log("updating obstacle position: id ", id, " x:", Math.round(x), " y:", Math.round(y))
        }

        window.updateObstacle(id, Math.round(x), Math.round(y));
        console.log(this.chair.id, 'obstacles', window.obstacles);
    }

    resetStepIndex() {
        this.controller.stepIndex = 0;
        this.controller.rotationReady = true;
        this.controller.errorState = false;
    }
}