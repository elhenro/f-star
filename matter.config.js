/*
* Simulation engine
*/
// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body;

// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        showBroadphase: true,
        showVelocity: true,
        showCollisions: true,
        showAngleIndicator: true,
        height: 600,
        width: 600
    }
});

engine.world.gravity.y = 0;

// Create outer walls
let topWall = Bodies.rectangle(render.options.width / 2, 1, render.options.width, 1, {isStatic: true});
let rightWall = Bodies.rectangle(render.options.width - 1, render.options.height / 2, 1, render.options.height, {isStatic: true});
let bottomWall = Bodies.rectangle(render.options.width / 2, render.options.height - 1, render.options.width, 1, {isStatic: true});
let leftWall = Bodies.rectangle(1, render.options.height / 2, 1, render.options.height, {isStatic: true});