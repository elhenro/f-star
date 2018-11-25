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

for (let box of boxes) {
    console.log(box);
}

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
    Body.setVelocity(boxes[0], {x: 2, y: -7});
});

$('.test').on('click', function () {
    let d = getLocationOnGrid(boxes[0].position.x, boxes[0].position.y)
    console.log("coordinates of box[0]: ",d)
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
function getRotationOfBox(box){
    return box.angle
}

function moveUp(box){
    //get coordinates
    loc = getLocationOnGrid(box.position.x, box.position.y)
    //get rotation
    rot = getRotationOfBox(box)

    adjustAngle(box, "up")
    console.log(loc, rot)
}

function adjustAngle(box, direction){
    if(direction == "up"){
        Body.rotate(box, -(box.angle))
        console.log("new angle: ", box.angle)
    }
}


// add all of the bodies to the world
World.add(engine.world, boxes);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

