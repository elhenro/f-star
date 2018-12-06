class Simulation {
    constructor() {
    }

    createChair(posX = 0, posY = 0) {
        console.log('Chair created');
        let chair = Bodies.rectangle(posX, posY, 20, 20);
        // add chair to the world
        World.add(engine.world, [chair]);
        return chair;
    }

    getPosition(actor) {
        return actor.position;
    }

    applyForce(actor, motionType, force, speed) {
        switch (motionType) {
            case 'Straight':
                Body.setVelocity(actor, {
                    x: force.x * speed,
                    y: force.y * speed
                });
                break;
            case 'Rotation':
                Body.setAngularVelocity(actor, speed);
                break;
        }
    }
}