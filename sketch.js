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


// create obstacles
let obstacles = [];
for (let i = 0; i < 4; i++) {
    obstacles.push(Bodies.rectangle(Math.random() * 800, Math.random() * 400, 20, 20, {render: {lineWidth: 10}}));
}


// create a ground
var ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true, frictionAir: 1});
/*
for (let box of boxes) {
    console.log(box);
}*/
let testStartLocation = getLocationOnGrid(boxes[0].position.x, boxes[0].position.y)
console.log("start location of box 0: ", testStartLocation)

console.log("test target on top: ", getNeighbourTile(testStartLocation, "up"))

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


$('.moveUp').on('click', function () {
    move(boxes[0], "up")
});

$('.moveDown').on('click', function () {
    move(boxes[0], "down")
});

$('.moveRight').on('click', function () {
    move(boxes[0], "right")
});

$('.moveLeft').on('click', function () {
    move(boxes[0], "left")
});

$(document).keydown(function(e){
    if (e.which == 37) { 
        move(boxes[0], "left")
    }
    if (e.which == 38) { 
        move(boxes[0], "up")
    }
    if (e.which == 39) { 
        move(boxes[0], "right")
    }
    if (e.which == 40) { 
        move(boxes[0], "down")
    }
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
let driveDirectionY = 0
let driveDirectionX = 0
let driveSpeed = 0.1

function move(box, direction){
    let loc = getLocationOnGrid(box.position.x, box.position.y);
    adjustAngle(box, direction)

    targetTile = getNeighbourTile(loc, direction)
    console.log("tile: ", loc, " neighbour: ", targetTile)

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
    driveInterval = setInterval(driveIfNotArrived, 100);
}


function driveIfNotArrived(){
    let loc = getLocationOnGrid(boxes[0].position.x, boxes[0].position.y)

    let arrived
    if (driveDirectionY != 0){
        arrived = checkIfArrivedAtHeight(loc, targetTile)
    } else if (driveDirectionX != 0){
        arrived = checkIfArrivedAtWidth(loc, targetTile)
    }
    if (!arrived){
        drive(boxes[0], driveDirectionX, driveDirectionY, driveSpeed)
    } else
    if (arrived){
        stop(boxes[0])
        clearInterval(driveInterval)
        driveDirectionX = 0
        driveDirectionY = 0
    }
}

function checkIfArrivedAtHeight(loc, tloc){
    console.log("comparing ",loc[1], " and ", tloc[1])

    let tf = (loc[1] == tloc[1])
    console.log(tf)
    return tf
}

function checkIfArrivedAtWidth(loc, tloc){
    console.log("comparing ",loc[0], " and ", tloc[0])
    let tf = (loc[0] == tloc[0])
    console.log(tf)
    return tf
}

function adjustAngle(box, direction) {
    // just reset straight
    Body.rotate(box, -(box.angle))
}


function getNeighbourTile(coordinates, direction){
    let stepSize = 5
    if (direction == "up"){
        return [coordinates[0], (coordinates[1] - stepSize)]
    }
    if (direction == "down"){
        return [coordinates[0], (coordinates[1] + stepSize)]
    }
    if (direction == "right"){
        return [(coordinates[0] + stepSize), coordinates[1]]
    }
    if (direction == "left"){
        return [(coordinates[0] - stepSize), coordinates[1]]
    }
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
World.add(engine.world, obstacles);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);