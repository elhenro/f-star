/*
* Simulation engine
*/
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


// Create outer walls
let topWall = Bodies.rectangle(400, 1, 800, 1, {isStatic: true});
let rightWall = Bodies.rectangle(799, 300, 1, 600, {isStatic: true});
let bottomWall = Bodies.rectangle(400, 599, 800, 1, {isStatic: true});
let leftWall = Bodies.rectangle(1, 300, 1, 600, {isStatic: true});