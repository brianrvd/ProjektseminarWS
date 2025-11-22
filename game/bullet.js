const Element = require('./element')

module.exports = class Bullet extends Element {
    constructor(startX, startY, targetId, game) {
        super()
        this.x = startX
        this.y = startY
        this.targetId = targetId  // instanceId des CIRCLE-ELEMENTS (nicht des Worts!)
        this.game = game
        this.hasCollided = false
        this.targetX = 0
        this.targetY = 0
    }

    draw(ctx) {
        if (this.hasCollided) return
        ctx.fillStyle = '#ff0'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 10
        ctx.shadowColor = '#ff0'
        ctx.fill()
        ctx.shadowBlur = 0
    }

    action() {
        if (this.hasCollided) return
        
        // Hole aktuelle Position des Ziel-Kreises (falls er existiert)
        const target = this.game.elementList.get(this.targetId)
        if (target) {
            this.targetX = target.x
            this.targetY = target.y
            
            // Richtungsvektor neu berechnen (verfolge bewegtes Ziel)
            const dx = this.targetX - this.x
            const dy = this.targetY - this.y
            const dist = Math.hypot(dx, dy)
            
            if (dist > 1) {
                this.vx = (dx / dist) * 8
                this.vy = (dy / dist) * 8
                this.x += this.vx
                this.y += this.vy
            }
        }
    }

    checkCollision() {
        // Ziel-Kreis existiert nicht mehr (z.B. gelandet)?
        if (this.game.elementList.get(this.targetId) == null) {
            this.onCollision()
        }
        
        // Ziel-Kreis erreicht?
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 15) {
            this.onCollision()
        }
        
        // Außerhalb?
        if (this.x < 0 || this.x > window.innerWidth || 
            this.y < 0 || this.y > window.innerHeight) {
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
    }
}

