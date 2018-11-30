/*
* Start engine
*/
// add all of the bodies to the world
World.add(engine.world, chairs);
/*World.add(engine.world, obstacles);
World.add(engine.world, [target]);
World.add(engine.world, path);*/

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
