class Simulation {
    constructor() {
    }

    createChair(posX = 0, posY = 0) {
        let randomDigi = Math.floor(Math.random() * 5) + 1;
        let chair = Bodies.rectangle(posX, posY, 80, 80, {
            render: {
                sprite: {
                    texture: "assets/images/emoji_" + randomDigi + ".png",
                    xScale: 0.5,
                    yScale: 0.5
                }
            }
        });
        // add chair to the world
        World.add(engine.world, [chair]);

        console.log('Chair created:', chair);
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