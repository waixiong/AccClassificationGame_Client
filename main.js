//const GameCanvas = document.getElementById('GameC');
//import Preloader from './Scene/LoadS'
//import Menu from './Scene/MenuS'

var config = {
    type: Phaser.AUTO,
    parent: "GameContainer",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 600,
    height: 864,
    //canvas: GameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    backgroundColor: 0xa0a0bf,
    audio: {
        disableWebAudio: true  // ensure support all browser, some browsers are not support web audio
    },
    scene: [Preloader, Menu]/*{
        preload: preload,
        create: create,
        update: update
    }*/
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
    this.add.image(200, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}

function update () 
{
    //here
}