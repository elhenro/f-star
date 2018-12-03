class Simulation {
    constructor() {
    }

    createChair(posX = 0, posY = 0) {
        console.log('Chair created');
        return Bodies.rectangle(posX, posY, 20, 20);
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