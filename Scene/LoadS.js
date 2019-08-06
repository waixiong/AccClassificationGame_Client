var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        //this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('documents', 'assets/image/documents.png');             // 2
        this.load.image('lorry', 'assets/image/lorry.png');                     // 2

        this.load.image('roll_receiver', 'assets/image/roll_receiver.png');     // 2
        this.load.image('sign', 'assets/image/sign.png');                       // 2
        this.load.spritesheet('roll', 'assets/image/roll.png', {
            frameHeight: 120,
            frameWidth: 600
        });                                                                     // 2
        this.load.image('scoreboard', 'assets/image/scoreboard.png');
        this.load.image('true', 'assets/image/True.png');
        this.load.image('false', 'assets/image/False.png');

        this.load.image('fence', 'assets/image/fence.png');                     // 1
        this.load.image('box', 'assets/image/box.png');                         // 1
        this.load.image('box Credit', 'assets/image/fish_bone.png');             // 1
        this.load.image('box Debit', 'assets/image/bone.png');                       // 1
        this.load.image('animal Debit', 'assets/image/dog.png');                // 1
        this.load.image('animal Credit', 'assets/image/cat.png');               // 1

        this.load.json('gData', 'assets/temp.json');

        this.load.audio('correct', 'assets/audio/true.mp3');
        this.load.audio('wrong', 'assets/audio/false.mp3');

        let bground = this.add.graphics({
            fillStyle: {
                color: 0x000000 //white
            }
        })
        bground.fillRect(0, 0, 600, 864);

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })

        this.load.on("progress", (percent) => {
            //loadingBar.fillRect(this.game.renderer.width / 2, 0, 50, this.game.renderer.height * percent);
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            //console.log(percent);
        })

        this.load.on("complete", () => {
            //this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
        });

        this.load.on("load", (file) => {
            //console.log(file.src)
        })
    },

    create: function ()
    {
        this.scene.start('menu');
    }

});