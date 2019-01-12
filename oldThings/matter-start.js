/*
* Start engine
*/
// Add all bodies to the world
//World.add(engine.world, [chair.chair]);
World.add(engine.world, [topWall, rightWall, bottomWall, leftWall]);
/*
World.add(engine.world, obstacles);
World.add(engine.world, [target]);
World.add(engine.world, path);*/

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
