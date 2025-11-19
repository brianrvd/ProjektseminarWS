"use strict"

module.exports = class Element {

    hasCollided = false

    constructor() {
        this.instanceId = -1
    }

    action() { }

    draw(ctx) { }

    checkCollision() { }

    onCollision() { }

    setId(id) {
        this.instanceId = id
    }
}