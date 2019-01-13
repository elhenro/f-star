/**
 * Matter JS wrapper for simulation purpose. Do not touch unless you intend to fix a bug.
 */

import {Engine, Render, World, Bodies, Body, Events} from 'matter-js';

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function positionFromShape(shape) {
    const angle = toDegrees(shape.angle) % 360;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    return {
        x: shape.position.x,
        y: shape.position.y,
        bearing: normalizedAngle + 90
    }
}

export default class Simulation {

    /**
     * Creates a new simulation environment for the smart chairs. Each chair is assumed to be 100cm in diameter, while the simulation
     * assumes 1px ~ 1cm.
     *
     * The simulation renders to the given DOM element, using Matterjs as physics and rendering engine.
     *
     * @param element DOM element simulation rendering should happen in; document.body by default.
     * @param chairCount The number of chairs to create in simulation. Can be left blank when 'positions' is used. 1 by default.
     * @param samplingRate The number of position updates for all chair per second. 10 by default
     * @param friction Friction of the ground. Delegated to matterjs. 0.1 by default.
     * @param width Width of the simulation canvas in pixels. 1000 by default.
     * @param height Height of simulation canvas in pixels. 1000 by default.
     * @param positions An array of pixel offsets {x: <value>, y: <value>} for each chair at the beginning of the simulation. If not present,
     * 'chairCount' is used to create the requested number of chairs in a default position at the top of the simulation canvas.
     */
    constructor({
                    element = document.body,
                    chairCount = 1,
                    samplingRate = 10,
                    friction = 0.1,
                    width = 1000,
                    height = 1000,
                    positions = []
                } = {}
    ) {
        // assemble everything but don't start
        const chairs = [...Array(Math.max(chairCount, positions.length)).keys()].map(index => ({
            velocity: {x: 0, y: 0},
            angularVelocity: 0,
            shape: (() => {
                const {
                    x = 100 + 100 * index,
                    y = 100
                } = positions[index] || {};

                const shape = Bodies.circle(x, y, 50);
                shape.frictionAir = friction;
                return shape;
            })(),
            position: void 0
        }))
        this.chairs = chairs;

        this.samplingRate = samplingRate;

        const engine = Engine.create();
        engine.world.gravity.y = 0;
        this.engine = engine;

        this.render = Render.create({
            element: element,
            engine: engine,
            options: {
                showAngleIndicator: true,
                height,
                width
            }
        });

        World.add(engine.world, chairs.map(({shape}) => shape));
    }

    getChairControl() {

        const simulation = this;

        const chairControl = {
            ready: false,
            getChairs: () => {
                return simulation.chairs.map(chair => ({
                    move({motionType, velocity}) {
                        this.stop();
                        switch (motionType) {
                            case 'Rotation' :
                                chair.angularVelocity = velocity * Math.PI / 72
                                return;
                            case 'Straight' :
                                const x = velocity * Math.cos(chair.shape.angle);
                                const y = velocity * Math.sin(chair.shape.angle);
                                chair.velocity = {x, y};
                        }
                    },
                    stop() {
                        chair.angularVelocity = 0;
                        chair.velocity = {x: 0, y: 0};
                    },
                    getPosition() {
                        return chair.position;
                    }
                }))
            },
            start: () => {
                const {
                    engine,
                    render,
                    chairs
                } = simulation;

                Engine.run(engine);
                Render.run(render);

                Events.on(engine, "afterUpdate", () => {
                    chairs.forEach(({shape, velocity, angularVelocity}) => {
                        if (angularVelocity != 0) {
                            Body.setAngularVelocity(shape, angularVelocity);
                        }

                        // without test here we would kill the slippage immediately
                        if (velocity.x != 0 || velocity.y != 0) {
                            Body.setVelocity(shape, velocity);
                        }
                    })
                })

                simulation.loop = setInterval(()=>{
                    chairs.forEach(chair => chair.position = positionFromShape(chair.shape));

                    if(!chairControl.ready ) {
                        chairControl.ready = true;
                        chairs.forEach(chair => chair.ready = true);
                        const {onReady} = chairControl;
                        if(typeof onReady === 'function'){
                            onReady(chairControl);
                        }
                    }

                }, 1000 / simulation.samplingRate);
            },
            shutdown(){
                const {
                    render,
                    engine,
                    loop
                } = simulation;
                Render.stop(render);
                Engine.clear(engine);
                clearInterval(loop);
                chairControl.ready = false;
            }
        }

        return chairControl;
    }

}