//const QUESTION_NUMBER = 20;
const MAXTIME = 10000; // 5000 ms
var _this2;
var _gameJSON;

var Game2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Game2 ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        _this2 = this;
    },

    init: function (data) 
    {
        this.gameType = data.type;
        this.username = data.username == null? 'Anonymous':data.username;
        this.question = 0;
        this.respondList = [];
        this.already_end = false;
        this.score = 0;
        this.displayScore = 0;
    },

    create: function ()
    {
        this.scene.remove('pregame');

        this.anims.create({
            key: "fast",
            frameRate: 60,
            repeat: -1, //repeat forever,
            frames: this.anims.generateFrameNumbers('roll', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            })
        });

        this.anims.create({
            key: "slow",
            frameRate: 15*5000/MAXTIME,
            repeat: -1, //repeat forever,
            frames: this.anims.generateFrameNumbers('roll', {
                frames: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
            })
        });

        _gameJSON = this.cache.json.get('gData')[this.gameType];
        this.list = Object.keys(_gameJSON['accounts']);

        // upper board
        this.scoreboard = this.add.image(300, 60, 'scoreboard');
        this.scoreboard.depth = 10;
        this.texts = {};
        this.texts.name = this.add.text(0, 0, this.username, { fontFamily: 'customfont', fontSize: '24px', color:'#000'});
        this.texts.name.y = 33 - this.texts.name.height/2;
        this.texts.name.x = 300 - this.texts.name.width/2;
        this.texts.name.depth = 10;
        this.texts.q = this.add.text(0, 0, ' ' + Math.round(this.question).toString() + ' / ' + QUESTION_NUMBER.toString(), { fontFamily: 'customfont', fontSize: '28px', color:'#fff'});
        this.texts.q.y = 86 - this.texts.q.height/2;
        this.texts.q.x = 87 - this.texts.q.width/2;
        this.texts.q.depth = 10;
        this.texts.score = this.add.text(0, 0, Math.round(this.displayScore).toString(), { fontFamily: 'customfont', fontSize: '28px', color:'#fff'});
        this.texts.score.y = 86 - this.texts.score.height/2;
        this.texts.score.x = 570 - this.texts.score.width;
        this.texts.score.depth = 10;

        var board = this.add.graphics({
            fillStyle: {
                color: 0xa6a6a6
            }
        })
        board.fillRect(0, 686, 600, 178);

        board = this.add.graphics({
            fillStyle: {
                color: 0x666666
            }
        })
        board.fillRect(0, 680, 600, 6);

        this.rolls = {};
        const conf = _gameJSON['config']
        for(var i = 0; i < _gameJSON['type'].length; i++){
            var center = conf['start'] + i * conf['between'];
            var type = _gameJSON['type'][i];
            this.rolls[type] = {
                //type: _gameJSON['type'][i],
                y: center,
                roll: this.add.sprite(150, center, 'roll'),
                lorry: this.add.image(540, center, 'lorry'),
                receiver: this.add.image(432, center, 'roll_receiver'),
                sign: this.add.image(300, center, 'sign')
            };
            this.rolls[type].text = this.add.text(0, 0, type, { fontFamily: 'customfont', fontSize: '20px', color:'#fff'});
            this.rolls[type].text.y = (center - 16) - this.rolls[type].text.height/2;
            this.rolls[type].text.x = 300 - this.rolls[type].text.width/2;
            
            this.rolls[type].roll.depth = 1;
            this.rolls[type].lorry.depth = 1;
            this.rolls[type].receiver.depth = 1;
            this.rolls[type].sign.depth = 1;
            this.rolls[type].text.depth = 1;
            
            this.rolls[type].roll.play("fast");

            this.rolls[type].sign.setInteractive();
            this.rolls[type].sign.name = type;
            this.rolls[type].roll.setInteractive();
            this.rolls[type].roll.name = type; 
        }

        var enterRoll = this.add.sprite(300, 740, 'roll')
        enterRoll.scale = 1.6;
        enterRoll.play("slow");

        this.input.on('gameobjectdown', this._onClick);

        this.nextorendgame();
    },

    update: function(time, delta) 
    {
        if(this.box != null && this.respondList.length < QUESTION_NUMBER && this.box.x <= -50){
            this.respondList.push(this.box.box_data);
            this.box.destroy();
            this.nextorendgame();
        }
        if(this.displayScore < this.score){
            this.displayScore += delta * 2;
            this.texts.score.text = Math.round(this.displayScore).toString();
            this.texts.score.y = 86 - this.texts.score.height/2;
            this.texts.score.x = 570 - this.texts.score.width;
        }else{
            this.displayScore = this.score;
            this.texts.score.text = Math.round(this.displayScore).toString();
            this.texts.score.y = 86 - this.texts.score.height/2;
            this.texts.score.x = 570 - this.texts.score.width;
        }
    },

    nextorendgame: function() {
        // NEXT OR END
        if(this.question < QUESTION_NUMBER) {
            this.create_box(this.random_question());
        } else {
            // for(var i = 0; i < _gameJSON['type'].length; i++){
            //     this.rolls[_gameJSON['type'][i]].sign.setInteractive(false);
            //     this.rolls[_gameJSON['type'][i]].roll.setInteractive(false);
            // }
            this.box = null;

            if(this.respondList.length == QUESTION_NUMBER){
                // endgame
                this.already_end = true;
                this.finish();
            }
            // else wait for validate
        }
    },

    _onClick: function(pointer, gameObject) {
        // ANSWER IS CHOSEN BY PLAYER
        // insert answer
        if(_this2.box == null) {
            return;
        }

        var old_box = _this2.box;
        old_box.box_data.answer = gameObject.name;
        old_box.box_data.end_time = Date.now();
        var tween = _this2.tweens.add({
            targets: _this2.box,
            x: 100,               // '+=100'
            y: gameObject.y - 24,
            scale: 0.5,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 200,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: function() {
                old_box.setVelocity(0, 0);
                old_box.depth = 0;
                _this2.tweens.add({
                    targets: old_box,
                    x: 436,               // '+=100'
                    y: gameObject.y - 24,
                    scale: 0.5,               // '+=100'
                    ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 1120,
                    repeat: 0,            // -1: infinity
                    yoyo: false,
                    onComplete: function() {
                        // get score
                        _this2.respondList.push(old_box.box_data);
                        _this2._checkanswer(_this2.respondList[_this2.respondList.length-1]);
                        old_box.destroy();
                        if(_this2.respondList.length == QUESTION_NUMBER){
                            // endgame
                            _this2.already_end = true;
                        }
                    }
                });
            }
        });

        _this2.nextorendgame();
    },

    _checkanswer: function(data) {
        var t;
        data.delta_time = data.end_time - data.start_time;
        console.log(data.delta_time);
        if(_gameJSON['accounts'][data.question] == data.answer){
            data.result = 'correct';
            this.sound.play('correct');
            t = this.add.image(432 + 48, this.rolls[data.answer].receiver.y - 35, 'true');
            var s = 1000 * (MAXTIME-data.delta_time)/MAXTIME;
            this.score += s>0? s : 0;
        }else{
            data.result = 'wrong';
            this.sound.play('wrong');
            t = this.add.image(432 + 48, this.rolls[data.answer].receiver.y - 35, 'false');
        }
        t.depth = 5;
        t.scale = 0.12;
        
        _this2.tweens.add({
            targets: t,
            scale: 0.6,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 400,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: function() {
                _this2.tweens.add({
                    targets: t,
                    scale: 0.66,
                    alpha: 0,
                    ease: 'Cubic', 
                    duration: 600,
                    repeat: 0,
                    yoyo: false,
                    onComplete: function() {
                        t.destroy();
                        if(_this2.already_end){
                            _this2.finish();
                        }
                    }
                });
            }
        });

    },

    create_box: function(question) {
        // CREATE BOX WITH GIVEN QUESTION
        this.question += 1;
        if((this.question)/10 < 1){
            this.texts.q.text = ' ' + Math.round(this.question).toString() + ' / ' + QUESTION_NUMBER.toString();    
        }else{
            this.texts.q.text = Math.round(this.question).toString() + ' / ' + QUESTION_NUMBER.toString();
        }
        this.box = this.physics.add.image(550, 700, 'documents');
        this.box.scale = 0.8;
        this.box.depth = 2;
        this.box.setVelocity(-600 / MAXTIME * 1000, 0);
        this.box.setBounce(1, 1);
        //this.box.setCollideWorldBounds(true);
        this.box.box_data = {}
        this.box.box_data.question = question;      // data{ question, answer, start_time, end_time }
        this.box.box_data.start_time = Date.now();
    },

    random_question: function() {
        // PRODUCE RANDOM QUESTION
        var n = Phaser.Math.Between(0, this.list.length-1);
        if(this.questionTag == null){
            var board = this.add.graphics({
                fillStyle: {
                    color: 0xffffff //white
                }
            })
            board.fillRect(30, 780, 540, 80);
            this.questionTag = this.add.text(300, 770, this.list[n], { fontFamily: 'customfont', fontSize: '18px', color:'#000', align:'center'});
        }else{
            this.questionTag.text = this.list[n];
        }
        this.questionTag.x = 300 - this.questionTag.width/2;
        this.questionTag.y = 820 - this.questionTag.height/2;
        this.questionTag.depth = 10;

        return this.list[n];
    },

    finish: function() {
        // END OF THE GAME
        this.scene.stop();
        var d = {}
        d.respondList = this.respondList;
        d.score = Math.round(this.score);
        d.username = this.username;
        d.gameType = '2';
        this.scene.add('postgame', Postgame);
        this.scene.start('postgame', d);
        //this.scene.switch('subgame');
    },

});