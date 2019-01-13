import GetRoute from "../oldThings/getRoute.js";

export default class ChairController {
    constructor(chairControl, id) {
        let self = this;

        // enable / disable console logging for more information
        this.debug = window.debug || false;
        this.id = id;

        this.chairControl = chairControl;

        this.controller = {
            path: [], // comes from app.js
            finalRotationAngle: null,
            direction: "",
            wantedAngularRotation: null,
            rotationSpeed: 0.5,
            driveReady: false,
            rotationReady: true,
            stepIndex: 0,
            moveSpeed: 0.5,
            timeout: 50,
            forceX: 0,
            forceY: 0,
            rotationIntervalTime: 5,
            moveIntervalTime: 3,
            rotationIntervalID: null,
            moveIntervalID: null, 
            arrivedState: false,
            rotationInterval: function () {
                if (self.controller.rotationReady) {
                    let angleSlowDownRegion = 10;
                    let wantedAngle = Math.round(self.controller.wantedAngularRotation);
                    let actualAngle = Math.round(self.chairControl.getPosition().bearing - 90); // !!! OK!!! todo: why????
                    let arrivedAtAngle = (actualAngle === wantedAngle);

                    // update obstacles
                    let position = self.chairControl.getPosition();
                    self.updateObstaclePosition(self.getId(), /*self.round10(*/position.x/*)*/, /*self.round10(*/position.y/*)*/);

                    // Chair is does not look towards the wanted direction.
                    // Start rotation
                    if (arrivedAtAngle === false) {
                        self.controller.driveReady = false;
                        clearInterval(self.controller.moveIntervalID);

                        let speed = self.controller.rotationSpeed;

                        // If chair angle is close to wanted angle, decrease speed
                        if (actualAngle <= (wantedAngle + angleSlowDownRegion) && actualAngle >= (wantedAngle - angleSlowDownRegion)) {
                            speed = speed / 10;
                        }

                        if(this.debug) console.log('comparing rotations:', actualAngle, wantedAngle);
                        // Start rotatinwantedAngleg
                        if (this.debug) console.log(actualAngle, wantedAngle);

                        if (actualAngle < wantedAngle) {
                            if (Math.abs(actualAngle - wantedAngle) < 180)
                                self.chairControl.move({motionType: 'Rotation', velocity: speed});
                            else self.chairControl.move({motionType: 'Rotation', velocity: -speed});
                        } else {
                            if (Math.abs(actualAngle - wantedAngle) < 180)
                                self.chairControl.move({motionType: 'Rotation', velocity: -speed});
                            else self.chairControl.move({motionType: 'Rotation', velocity: speed});
                        }

                    } else if (arrivedAtAngle === true) {
                        if (this.debug) console.log("adjusted rotation successfully: ", actualAngle, wantedAngle);

                        self.controller.driveReady = true;
                        self.controller.rotationReady = false;

                        // stop spinning
                        self.stop();

                        // set movement interval
                        self.controller.moveIntervalID = setInterval(self.controller.moveInterval, self.controller.moveIntervalTime)
                    }
                }
            },
            moveInterval: function () {
                let nextTarget = self.controller.path[self.controller.stepIndex];

                if (this.debug) {
                    console.log("NEXT TARGET ", nextTarget, " current position: ", (Math.round(self.chairControl.getPosition().x) / 10), (Math.round(self.chairControl.getPosition().y) / 10));
                }

                if (self.controller.driveReady === false) {
                    if (this.debug) {
                        console.log("not ready to move.");
                    }
                    self.stop();
                }

                // if is ready to move
                if ((self.controller.driveReady === true) && (nextTarget != undefined)) {

                    // prevent collision todo: does not work
                    if (self.stepBlockedByObstacle(nextTarget, this.window.obstacles)) {
                        self.stop();
                        return;
                    } else {
                        // update obstacles with own id and positions (round to 10)
                        let position = self.chairControl.getPosition();
                        self.updateObstaclePosition(self.getId(), /*self.round10(*/position.x/*)*/,/* self.round10(*/position.y/*)*/);

                        // actually move
                        self.move(self.controller.direction);

                        self.setTimeoutInterval();
                        //if(!self.controller.timeOutSet){
                        // self.controller.timeoutIntervalSeconds = 0; //reset
                        //}
                    }
                }

                // if is arrived at current target
                if (this.debug) console.log("checking if arrived at:", nextTarget, " current: ", self.chairControl.getPosition())

                if (self.isArrived(nextTarget)) {
                    //test: move up outside of arrived, do it every time instead: be more acurate
                    //let position = self.chairControl.getPosition();
                    //self.updateObstaclePosition(self.getId(), position.x, position.y);

                    //self.controller.timeOutIntervalReset = true;
                    //self.setTimeoutInterval();


                    self.controller.stepIndex++;
                    if (self.debug) {
                        console.log(self.chairControl, "X X X X X X X --- arrived at ", nextTarget, "! :) ---  X X X X X X X X");
                        console.log("new target is: ", self.controller.path[self.controller.stepIndex]);
                    }

                    self.controller.driveReady = false;
                    self.controller.rotationReady = true;

                    clearInterval(self.moveIntervalID);
                    self.stop();

                    // NEXT
                    let currentLoc = self.getLocationOnGrid(self.chairControl.getPosition());
                    // todo... L
                    currentLoc.x = currentLoc.x * 100;
                    currentLoc.y = currentLoc.y * 100;
                    if (self.controller.path[self.controller.path.length - 1]) {
                        self.controller.path = new GetRoute(currentLoc, {
                            x: self.controller.path[self.controller.path.length - 1][0],
                            y: self.controller.path[self.controller.path.length - 1][1]
                        });
                        self.resetStepIndex(); //todo: kill
                        self.followPath(self.controller.path, self.controller.finalRotationAngle);
                    } else {
                        if (this.debug) {
                            console.log("no new path")
                        }
                    }
                }

                // if is arrived at last step
                if (self.isArrived(self.controller.path[(self.controller.path.length - 1)])) {
                    if (!self.controller.arrivedState) console.log("arrived at final location! <3");
                    self.controller.arrivedState = true;

                    // interval clears itself
                    clearInterval(self.controller.moveIntervalID);

                    self.controller.driveReady = false;
                    self.controller.rotationReady = true;

                    if(self.debug) console.log("resetting arrived actor: ", self.getId())
                    self.resetReady();
                    if (self.debug) console.log("rotating to final rotation angle", self.controller.finalRotationAngle);
                    self.controller.wantedAngularRotation = self.controller.finalRotationAngle;
                    //console.log(self.controller);
                    self.adjustAngle(self.controller.finalRotationAngle);
                }

                if (nextTarget == undefined && self.controller.arrivedState !== true) {
                    self.errorState = true;
                    self.stop();
                    if (this.debug) {
                        self.errorMsg = "no target";
                        console.log(self.errorMsg);
                    }
                }
            },
            // @MArco: Timoutinterval der ab jedem step anfängt bis 10 zu zählen (1000ms interval)
            // bei 10 soll er den actor wieder zurück schicken zum letzten punkt
            // und dann pathfinding neu starten
            //
            //  funktioniert noch nicht ab jedem step
            timeoutIntervalID: null,
            timeOutSet: false,
            timeoutIntervalTime: 1000,
            timeoutIntervalSeconds: 0,
            timeOutIntervalReset: false,
            timeoutInterval: function (){
                if(self.controller.timeoutIntervalSeconds > 10/* || self.controller.timeOutIntervalReset*/){
                    console.log("timed out")
                    self.controller.timeOutIntervalReset = false;
                    clearInterval(self.controller.timeoutIntervalID);
                    self.controller.timeoutIntervalSeconds = 0; //reset
                    self.controller.timeOutSet = false;
                } else {
                    self.controller.timeoutIntervalSeconds += 1;
                    console.log(self.controller.timeoutIntervalSeconds)
                }
            },
            errorState: false,
            errorMsg: "",
        };
    }

    followPath(path, finalRotationAngle = 270) {
        if (!this.controller.errorState) {
            this.controller.path = path;

            if (this.debug) console.log("setting final rotationangle to ", finalRotationAngle)
            this.controller.finalRotationAngle = finalRotationAngle;

            //target is neighbour tile
            if (this.isNeighbour(path[this.controller.stepIndex])) {
                if (this.debug) {
                    console.log("getting next direction for step number [", this.controller.stepIndex, "] : ", path[this.controller.stepIndex])
                }

                if (this.whereToMove(path[this.controller.stepIndex]) != "err") {
                    this.controller.direction = this.whereToMove(path[this.controller.stepIndex]);
                } else {
                    console.log(this.errorMsg);
                    return
                }

                // continue
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

    // spin me right round, sets the rotation interval
    adjustAngle(angle = null) {
        if (angle === null) {
            //let angle = Math.atan2(pos.y - (this.controller.path[this.controller.stepIndex][1] * 100), pos.x - (this.controller.path[this.controller.stepIndex][0] * 100));
            let p1 = this.chairControl.getPosition();
            let p2 = {
                x: Math.round(this.controller.path[this.controller.stepIndex][0] * 100),
                y: Math.round(this.controller.path[this.controller.stepIndex][1] * 100)
            };

            if (this.debug) console.log(p1, p2);
            angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
            angle = (angle + 360) % 360;
            // dirty // davids schnitstelle macht + 90 ...
            if (angle === -90) angle = 270;

            if (this.debug) console.log(this.chairControl.getPosition(), "Started rotating to: ", angle);
        }

        this.controller.wantedAngularRotation = angle;
        this.controller.rotationIntervalID = setInterval(this.controller.rotationInterval, this.controller.rotationIntervalTime)
    }

    // Accelerates the chair
    move() {
        this.chairControl.move({motionType: 'Straight', velocity: this.controller.moveSpeed})
    }

    // check if actor has arrived ar target coordinates like: [position.x, position.y]
    isArrived(target) {
        let bufferRadius = 5;

        if (typeof target === 'undefined') {
            // arrival case
            let pos = this.chairControl.getPosition();
            if (this.debug) console.log(this.getId(), " arrived at: target : ", Math.round(pos.x), Math.round(pos.y));
            //this.controller.errorState = true;
            this.controller.rotationReady = false;
            this.controller.driveReady = false;
            this.stop();
            return true;
        }

        let chairPos = this.chairControl.getPosition();//this.simulation.getPosition(this.chair);

        let distanceToNextStep = Math.sqrt(Math.pow(chairPos.x - (target[0] * 100), 2) + Math.pow(chairPos.y - (target[1] * 100), 2));
        let chairIsArrived = (distanceToNextStep < bufferRadius);
        if (this.debug) {
            console.log({
                'Position': chairPos,
                'Target': target,
                'Setp Index': this.stepIndex,
                'Is arrived': chairIsArrived
            });
        }

        return chairIsArrived;
    }

    // Returns "up", "right", "down" or "left"
    // depending on the direction the chair has
    // to move to arrive at the target location
    whereToMove(target) {
        if (this.debug) console.log("called: whereToMove(", target, ")");

        if (!target) {
            // arrived at target (or error and no next target)
            this.errorState = true;
            this.errorMsg = "no next target for chair ID: " + this.getId();
            this.stop();
            //this.followPath(this.controller.path);
            return "err";
        }

        if (this.debug) {
            console.log("current position: ", this.getLocationOnGrid(this.chairControl.getPosition()/*this.simulation.getPosition(this.chair))*/));
        }

        let chairGridPos = this.getLocationOnGrid(this.chairControl.getPosition()/*this.simulation.getPosition(this.chair)*/);

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
        clearInterval(this.controller.moveIntervalID);
        clearInterval(this.controller.rotationIntervalID);
        this.chairControl.stop()
    }

    stepBlockedByObstacle(step, obstacles) {
        if (this.debug) {
            console.log("checking if next step blocked by obstacle ", step, obstacles)
        }
        for (let obstacle of obstacles) {
            if (obstacle[1] == (step[0] * 10) && obstacle[2] == (step[1] * 10)) {
                if (this.debug) {
                    console.log("chairID:", this.getId(), "step:", step, " was blocked by obstacle: ", obstacle);
                }
                return true
            }
        }
        return false
    }

    getNewWay() {
        // TODO: !
        // re-call followPath(), because actor was stop() 'ed before 
    }

    getId() {
        return this.id;
    }

    updateObstaclePosition(id, x, y) {
        if (this.debug) {
            console.log("updating obstacle position: id ", id, " x:", Math.round(x), " y:", Math.round(y))
        }

        window.updateObstacle(id, Math.round(x), Math.round(y));
        //console.log("updated obstacles. now it is: ", window.obstacles);
    }

    resetStepIndex() {
        this.controller.stepIndex = 0;
        this.controller.rotationReady = true;
        this.controller.errorState = false;
    }

    resetReady() {
        // reset all values to defaults set in app.js window.chairConfig
        let c = this.controller;
        let w = window.chairConfig;

        //c.finalRotationAngle        = w.finalRotationAngle;
        c.direction                 = w.direction;
        c.wantedAngularRotation     = w.wantedAngularRotation;
        c.rotationSpeed             = w.rotationSpeed;
        c.driveReady                = w.driveReady;
        c.rotationReady             = w.rotationReady;
        c.stepIndex                 = w.stepIndex;
        c.moveSpeed                 = w.moveSpeed;
        c.timeout                   = w.timeout;
        c.forceX                    = w.forceX;
        c.forceY                    = w.forceY;
        c.rotationIntervalTime      = w.rotationIntervalTime;
        c.moveIntervalTime          = w.moveIntervalTime;
        c.rotationIntervalID        = w.rotationIntervalID;
        c.moveIntervalID            = w.moveIntervalID;
        c.arrivedState              = w.arrivedState;
    }
    round5(x) {
        return Math.ceil(x/5)*5;
    }
    round10(num,pre) {
        if( !pre) pre = 0;
        //var pow = Math.pow(10,pre);

        let rounded = Math.floor(num / 10) * 10
        //let rounded = Math.ceil(Math.round(num*pow)/pow /10)*10 - 10
        //console.log("round ", num , " to ", rounded)
        return rounded;
    }

    setTimeoutInterval(){
        // if no timeout
        if(!this.controller.timeOutSet){
            // start new
            this.controller.timeOutSet = true;
            this.controller.timeoutIntervalSeconds = 0;
            this.controller.rotationIntervalID = setInterval(this.controller.timeoutInterval, this.controller.timeoutIntervalTime)
        } else {
        }
    }
}
