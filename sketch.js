// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

engine.world.gravity.y = 0;

// create some boxes
let boxes = [];
for (let i = 0; i < 6; i++) {
    boxes.push(Bodies.rectangle(400, 200, 20, 20));
}

// create a ground
var ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true, frictionAir: 1});
/*
for (let box of boxes) {
    console.log(box);
}*/
let testStartLocation = getLocationOnGrid(boxes[0].position.x, boxes[0].position.y)
console.log("start location of box 0: ", testStartLocation)

console.log("test target on top: ", getTileOnTop(testStartLocation))

// Get the position of the boxes
Events.on(engine, 'afterUpdate', function () {
    let boxLocations = "";
    for (let box of boxes) {
        let positionX = Math.round(box.position.x);
        let positionY = Math.round(box.position.y);
        boxLocations += '<p>X: ' + positionX + ' Y: ' + positionY + '</p>';
    }

    $('#locations').html(boxLocations);

});

$('.linear').on('click', function () {
    drive(boxes[0], 2, -7, 0.1);
});

$('.rotate').on('click', function () {
    rotate(boxes[0]);
});

$('.break').on('click', function () {
    stop(boxes[0]);
});

$('.test').on('click', function () {
    let d = getLocationOnGrid(boxes[0].position.x, boxes[0].position.y);
    console.log("coordinates of box[0]: ", d);
    Body.rotate(boxes[0], 0.7)
});

$('.move').on('click', function () {
    moveUp(boxes[0])
});

function getLocationOnGrid(x, y) {
    let xVal = Math.round(x / 10)
    let yVal = Math.round(y / 10)
    let coordinates = [xVal, yVal]
    return coordinates
}

function getRotationOfBox(box) {
    return box.angle
}

let driveInterval
let targetTile

function moveUp(box) {
    adjustAngle(box, "up");
    //Events.on(engine, 'afterUpdate', function () {
        //get coordinates
    let loc = getLocationOnGrid(box.position.x, box.position.y);
        //get rotation
    let rot = getRotationOfBox(box);
    adjustAngle(box, "up")

    //console.log(loc, rot)

    targetTile = getTileOnTop(loc)
    //console.log("tile on top of ", loc, " is ", tileOnTop)

    driveInterval = setInterval(driveIfNotArrived, 500);
}

function driveIfNotArrived(){
    let loc = getLocationOnGrid(boxes[0].position.x, boxes[0].position.y)

    let arrived = checkIfArrivedAtHeight(loc, targetTile)
    if (!arrived){
        drive(boxes[0], 0, -1, 0.1)
    } else
    if (arrived){
        stop(boxes[0])
    }
}

function checkIfArrivedAtHeight(loc, tloc){
    console.log("comparing ",loc[1], " and ", tloc[1])

    let tf = (loc[1] == tloc[1])
    console.log(tf)
    return tf
}

function adjustAngle(box, direction) {
    if (direction == "up") {
        Body.rotate(box, -(box.angle));
    }
    if(direction == "down"){
        Body.rotate(box, (-(box.angle)-0.5))
    }
    if(direction == "right"){
        Body.rotate(box, (-(box.angle) + 0.25))
    }
    if(direction == "left"){
        Body.rotate(box, (-(box.angle) - 0.25))
    }

    console.log("new angle: ", box.angle);
}

function getTileOnTop(coordinates){
    return [coordinates[0], (coordinates[1] - 1)]
}

function getTileBelow(coordinates){
    return [coordinates[0], (coordinates[1] + 1)]
}


// add all of the bodies to the world
World.add(engine.world, boxes);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);


function drive(element, x, y, speed = 1) {
    Events.on(engine, 'afterUpdate', function () {
        Body.setVelocity(element, {x: x * speed, y: y * speed});
    });
}

function rotate(element, clockwise = true, speed = 1) {
    let rotation = 0.01 * speed;
    if (!clockwise) {
        rotation = -0.01 * speed;
    }

    Events.on(engine, 'afterUpdate', function () {
        Body.rotate(element, rotation);
    });
}

function stop(element) {
    drive(element, 0, 0);
    rotate(element, true, 0);
}


// add all of the bodies to the world
World.add(engine.world, boxes);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);