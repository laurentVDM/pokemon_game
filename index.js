const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024 
canvas.height = 576 

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const imageFond = new Image()
imageFond.src = './img/ville1.png'

const playerImage = new Image()
playerImage.src = "./img/personage.png"

class Sprite{
    constructor({position, image, velocity}){     //l'argument entre{} fait que l'ordre n'importe pas
        this.position = position
        this.image = image
    }
    //fonction qui dessine
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    position :{
        x:-196,
        y:-1024
    },
    image : imageFond
})

const keyboard = {
    z:{pressed: false},
    q:{pressed: false},
    s:{pressed: false},
    d:{pressed: false},
}

function animatePlayerMovement(){
    window.requestAnimationFrame(animatePlayerMovement)
    background.draw()    
    c.drawImage(
        playerImage,
        //cropping
        0,
        0,
        (playerImage.width/4),
        (playerImage.height/4),
        //actual
        (canvas.width / 2 - (playerImage.width /4) /2),
        (canvas.height / 2 - playerImage.height / 4),
        (playerImage.width / 2),
        (playerImage.height / 2),
    )
    if(keyboard.z.pressed && lastKey ==='z')background.position.y +=4
    else if(keyboard.q.pressed && lastKey ==='q')background.position.x +=4
    else if(keyboard.s.pressed && lastKey ==='s')background.position.y -=4
    else if(keyboard.d.pressed && lastKey ==='d')background.position.x -=4   
}
animatePlayerMovement()

//lecture clavier appuye
let lastKey = ''
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'z':
            keyboard.z.pressed=true
            lastKey='z'
            break
        case 'q':
            keyboard.q.pressed=true
            lastKey='q'
            break
        case 's':
            keyboard.s.pressed=true
            lastKey='s'
            break
        case 'd':
            keyboard.d.pressed=true
            lastKey='d'
            break
    }
})

//lecture clavier appuye plus
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'z':
            keyboard.z.pressed=false
            break
        case 'q':
            keyboard.q.pressed=false
            break
        case 's':
            keyboard.s.pressed=false
            break
        case 'd':
            keyboard.d.pressed=false
            break
    }
})