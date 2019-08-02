var Pregame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Pregame ()
    {
        Phaser.Scene.call(this, { key: 'pregame' });
    },

    init: function (data) 
    {
        this.gameData = data;
        this._gameJSON = this.cache.json.get('gData')[data.type];
        this.countdown = 3000;
        this.startcountdown = false;
    },

    create: function ()
    {
        _this = this;
        let bground = this.add.graphics({
            fillStyle: {
                color: 0x000000 //white
            }
        })
        bground.fillRect(0, 0, 600, 864);

        var destriptionText = this.add.text(0, 0, this._gameJSON['destription'], { fontFamily: 'customfont', fontSize: '25px', color:'#fff', align:'center'});
        destriptionText.x = 300 - destriptionText.width/2;
        destriptionText.y = 250 - destriptionText.height/2;

        this.readyText = this.add.text(0, 0, 'READY?', { fontFamily: 'customfont', fontSize: '60px', color:'#fff'});
        this.readyText.x = 300 - this.readyText.width/2;
        this.readyText.y = 500 - this.readyText.height/2;

        this.rText = this.add.text(0, 0, 'Press anywhere to start', { fontFamily: 'customfont', fontSize: '24px', color:'#fff'});
        this.rText.x = 300 - this.rText.width/2;
        this.rText.y = 550 - this.rText.height/2;

        this.input.on('pointerdown', function(pointer){
            _this.startcountdown = true;
            _this.tweens.add({
                targets: bground,
                alpha: 0,
                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 3000,
                repeat: 0,            // -1: infinity
                yoyo: false,
                onComplete: function() {
                    _this.scene.stop();
                    //_this.scene.start('menu');
                    _this.scene.add('game', Game);
                    _this.scene.start('game', _this.gameData);
                }
            });
        });
    },

    update: function(time, delta) {
        if(this.startcountdown){
            this.rText.setVisible(false);
            this.countdown -= delta;
            this.readyText.text = Math.ceil(this.countdown / 1000);
            this.readyText.x = 300 - this.readyText.width/2;
            this.readyText.y = 500 - this.readyText.height/2;
        }
    }

});

/*
0: "_events"
​
1: "_eventsCount"
​
2: "scene"
​
3: "type"
​
4: "state"
​
5: "parentContainer"
​
6: "name"
​
7: "active"
​
8: "tabIndex"
​
9: "data"
​
10: "renderFlags"
​
11: "cameraFilter"
​
12: "input"
​
13: "body"
​
14: "ignoreDestroy"
​
15: "x"
​
16: "y"
​
17: "z"
​
18: "w"
​
19: "defaultPipeline"
​
20: "pipeline"
​
21: "displayOriginX"
​
22: "displayOriginY"
​
23: "commandBuffer"
​
24: "defaultFillColor"
​
25: "defaultFillAlpha"
​
26: "defaultStrokeWidth"
​
27: "defaultStrokeColor"
​
28: "defaultStrokeAlpha"
​
29: "_lineWidth"
​
30: "_tempMatrix1"
​
31: "_tempMatrix2"
​
32: "_tempMatrix3"
*/