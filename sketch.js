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
var ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true, frictionAir: 1 });

for (let box of boxes) {
    console.log(box);
}

// Get the position of the boxes
Events.on(engine, 'afterUpdate', function () {
    /*for (let box of boxes) {
        console.log(box.position.x, box.position.y);
    }*/
});


$('.linear').on('click', function () {
    Body.setVelocity( boxes[0], {x: 2, y: -7});
});


// add all of the bodies to the world
World.add(engine.world, boxes);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

