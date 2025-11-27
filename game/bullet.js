const Element = require('./element')

module.exports = class Bullet extends Element {
    constructor(targetX, targetY, targetId, game) {
        super()
        // Startposition: Fest, wie du willst
        this.x = 270
        this.y = 520
        
        this.targetX = targetX
        this.targetY = targetY
        this.targetId = targetId  // instanceId des ZIEL-Kreises
        this.game = game
        this.hasCollided = false
        
        // Richtungsvektor
        const dx = targetX - this.x
        const dy = targetY - this.y
        const dist = Math.hypot(dx, dy) || 1
        this.vx = (dx / dist) * 8
        this.vy = (dy / dist) * 8
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
        
        // Ziel-Kreis-Position aktualisieren (er bewegt sich!)
        const target = this.game.elementList.get(this.targetId)
        if (target) {
            this.targetX = target.x
            this.targetY = target.y
            
            const dx = this.targetX - this.x
            const dy = this.targetY - this.y
            const dist = Math.hypot(dx, dy) || 1
            this.vx = (dx / dist) * 8
            this.vy = (dy / dist) * 8
        }
        
        this.x += this.vx
        this.y += this.vy
    }

    checkCollision() {
        if (this.game.elementList.get(this.targetId) == null) {
            this.onCollision()
        }
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 15) {
            this.onCollision()
            this.game.elementList.get(this.targetId).bulletMet();
        }
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
