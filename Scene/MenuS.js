var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Menu ()
    {
        Phaser.Scene.call(this, { key: 'menu' });
    },

    create: function ()
    {
        let bground = this.add.graphics({
            fillStyle: {
                color: 0x000000 //white
            }
        })
        bground.fillRect(0, 0, 600, 864);

        this.scene.remove('pregame');
        this.scene.remove('game');
        this.scene.remove('postgame');

        // var particles = this.add.particles('red');

        // var emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        var playButton1 = this.add.text(0, 0, 'GAME 1', { fontFamily: 'customfont', fontSize: '60px', color:'#fff'});
        playButton1.x = 300 - playButton1.width/2;
        playButton1.y = 450 - playButton1.height/2;
        // SET BUTTON
        playButton1.setInteractive();
        playButton1.on("pointerover", () => {
            // mouse in
            indicatorText.x = 300 - indicatorText.width/2;
            indicatorText.y = 450 - indicatorText.height/2;
            indicatorText.setVisible(true);
        })
        playButton1.on("pointerout", () => {
            // mouse out
            indicatorText.setVisible(false);
        })
        playButton1.on("pointerup", () => {
            // click
            // this.scene.add('game', Game);
            // this.scene.start('game', {
            //     type: '1'
            // });
            this.scene.add('pregame', Pregame);
            this.scene.start('pregame', {
                type: '1'
            });
        })

        var playButton2 = this.add.text(0, 0, 'GAME 2', { fontFamily: 'customfont', fontSize: '60px', color:'#fff'});
        playButton2.x = 300 - playButton2.width/2;
        playButton2.y = 550 - playButton2.height/2;
        // SET BUTTON
        playButton2.setInteractive();
        playButton2.on("pointerover", () => {
            indicatorText.x = 300 - indicatorText.width/2;
            indicatorText.y = 550 - indicatorText.height/2;
            indicatorText.setVisible(true);
        })
        playButton2.on("pointerout", () => {
            indicatorText.setVisible(false);
        })
        playButton2.on("pointerup", () => {
            // this.scene.add('game', Game);
            // this.scene.start('game', {
            //     type: '2'
            // });
            this.scene.add('pregame', Pregame);
            this.scene.start('pregame', {
                type: '2'
            });
        })

        var guideButton = this.add.text(0, 0, 'How To Play', { fontFamily: 'customfont', fontSize: '40px', color:'#fff'});
        guideButton.x = 300 - guideButton.width/2;
        guideButton.y = 636 - guideButton.height/2;
        // SET BUTTON
        guideButton.setInteractive();
        guideButton.on("pointerover", () => {
            indicatorText.x = 300 - indicatorText.width/2;
            indicatorText.y = 636 - indicatorText.height/2;
            indicatorText.setVisible(true);
        })
        guideButton.on("pointerout", () => {
            indicatorText.setVisible(false);
        })
        guideButton.on("pointerup", () => {
            console.log("GUIDE");
            //this.scene.add('game', Game);
            //this.scene.start('game', '2');

            // var xmlHttp = new XMLHttpRequest();
            // xmlHttp.open( "GET", './aquestion'); // false for synchronous request
            // xmlHttp.send( null );
            // xmlHttp.onreadystatechange = function(){
            //     if(this.readyState==4 && this.status==200){
            //        console.log(xmlHttp.responseText); 
            //     }else if(this.readyState==4){
            //         console.log('ERRRRRRRROR');
            //     }
            // }
        })

        var indicatorText = this.add.text(0, 0, '>        <', { fontFamily: 'customfont', fontSize: '60px', color:'#fff'});
        indicatorText.x = 300 - indicatorText.width/2;
        indicatorText.y = 450 - indicatorText.height/2;
        indicatorText.setVisible(false);
    }

});