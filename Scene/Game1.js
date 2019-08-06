const QUESTION_NUMBER = 20;
const MAXTIME1 = 10000; // 5000 ms
var _this1;
var _gameJSON;

var Game1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Game1 ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        _this1 = this;
    },

    init: function (data) 
    {
        this.gameType = data.type;
        this.username = data.username == null? 'Anonymous':data.username;
        this.questionAnswer = 0;
        this.questionGiven = 0;
        this.respondList = [];
        this.already_end = false;
        this.score = 0;
        this.displayScore = 0;
    },

    create: function ()
    {
        this.scene.remove('pregame');

        var grass = this.add.graphics({
            fillStyle: {
                color: 0x608038
            }
        })
        grass.fillRect(0, 0, 600, 864);

        this.boxes = this.add.group();

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
        this.texts.q = this.add.text(0, 0, ' ' + Math.round(this.questionAnswer).toString() + ' / ' + QUESTION_NUMBER.toString(), { fontFamily: 'customfont', fontSize: '28px', color:'#fff'});
        this.texts.q.y = 86 - this.texts.q.height/2;
        this.texts.q.x = 87 - this.texts.q.width/2;
        this.texts.q.depth = 10;
        this.texts.score = this.add.text(0, 0, Math.round(this.displayScore).toString(), { fontFamily: 'customfont', fontSize: '28px', color:'#fff'});
        this.texts.score.y = 86 - this.texts.score.height/2;
        this.texts.score.x = 570 - this.texts.score.width;
        this.texts.score.depth = 10;

        if((this.questionAnswer)/10 < 1){
            this.texts.q.text = ' ' + Math.round(this.questionAnswer).toString() + ' / ' + QUESTION_NUMBER.toString();    
        }else{
            this.texts.q.text = Math.round(this.questionAnswer).toString() + ' / ' + QUESTION_NUMBER.toString();
        }
        // questionTag
        var board = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })
        board.fillRect(30, 128, 540, 80);
        board.depth = 10;
        this.questionTag = this.add.text(300, 770, '', { fontFamily: 'customfont', fontSize: '18px', color:'#000', align:'center'});
        this.questionTag.x = 300 - this.questionTag.width/2;
        this.questionTag.y = 168 - this.questionTag.height/2;
        this.questionTag.depth = 10;

        this.aarea = {}  // UpperArea-216 D-182 A-224 C-242 fence-60

        const conf = _gameJSON['config']
        for(var i = 0; i < _gameJSON['type'].length; i++){
            var center = conf['start'] + i * conf['between'];
            var type = _gameJSON['type'][i];
            this.aarea[type] = {
                //type: _gameJSON['type'][i],
                y: center,
                animal_default_pos_x: 400*(1-i)+100,
                animal: this.physics.add.image(400*(1-i)+100, center, 'animal '+type)
            };
            this.aarea[type].text = this.add.text(0, 0, type, { fontFamily: 'customfont', fontSize: '20px', color:'#fff'});
            this.aarea[type].text.y = (center - 16) - this.aarea[type].text.height/2;
            this.aarea[type].text.x = 300 - this.aarea[type].text.width/2;
            
            this.aarea[type].animal.depth = i*9;
            this.aarea[type].text.depth = 1*9;
            this.aarea[type].targets = []
        }
        var dogfl = this.add.image(100, 368, 'fence');
        dogfl.depth = 1;
        var dogfr = this.add.image(500, 368, 'fence');
        dogfr.depth = 1;
        var catfl = this.add.image(100, 652, 'fence');
        catfl.depth = 8;
        var catfr = this.add.image(500, 652, 'fence');
        catfr.depth = 8;

        //this.input.setDraggable();
        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0x00ff00);
            _this1.questionTag.text = gameObject.box_data.question;
            _this1.questionTag.x = 300 - _this1.questionTag.width/2;
            _this1.questionTag.y = 168 - _this1.questionTag.height/2;
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX
            gameObject.y = dragY

            if(gameObject.y < 348){
                gameObject.depth = 0;
            }else if(gameObject.y > 632){
                gameObject.depth = 9;
            }else{
                gameObject.depth = 4;
            }
        });

        this.input.on('dragend', function (pointer, gameObject) {
            console.log('End of drag');
            gameObject.clearTint();
            _this1.questionTag.text = '';
            _this1.questionTag.x = 300 - _this1.questionTag.width/2;
            _this1.questionTag.y = 168 - _this1.questionTag.height/2;
            if(gameObject.y < 348 || gameObject.y > 632){
                if(gameObject.y < 348){
                    gameObject.box_data.answer = 'Debit';
                }else{
                    gameObject.box_data.answer = 'Credit';
                }
                _this1.questionAnswer++;
                if((_this1.questionAnswer)/10 < 1){
                    _this1.texts.q.text = ' ' + Math.round(_this1.questionAnswer).toString() + ' / ' + QUESTION_NUMBER.toString();    
                }else{
                    _this1.texts.q.text = Math.round(_this1.questionAnswer).toString() + ' / ' + QUESTION_NUMBER.toString();
                }
                _this1.input.setDraggable(gameObject, false);
                gameObject.box_data.end_time = Date.now()
                _this1._checkanswer(gameObject);
                _this1.nextorendgame();
            }
        });

        var s = this.nextorendgame();
        while(s){
            s = this.nextorendgame();
        }
    },

    update: function(time, delta) 
    {
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
        if(this.questionGiven < QUESTION_NUMBER && this.questionGiven<this.questionAnswer+5) {
            this.create_box(this.random_question());
            return true;
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
            } else {
                return false;
            }
            // else wait for validate
        }
    },

    _checkanswer: function(box) {
        var t;
        var data = box.box_data;
        data.delta_time = data.end_time - data.start_time;
        
        product = this.add.image(box.x, box.y, 'box '+_gameJSON['accounts'][data.question]);
        if(_gameJSON['accounts'][data.question] == data.answer){
            data.result = 'correct';
            if(data.answer == 'Credit'){
                product.depth = 9;
            }
            product.alpha = 0;
            //t = this.add.image(432 + 48, this.rolls[data.answer].receiver.y - 35, 'true');
        }else{
            data.result = 'wrong';
            //this.sound.play('wrong');
            //t = this.add.image(432 + 48, this.rolls[data.answer].receiver.y - 35, 'false');
        }
        _this1.respondList.push(data);
        //t.depth = 5;
        //t.scale = 0.12;
        
        _this1.tweens.add({
            targets: box,
            ease: 'Cubic',
            alpha:0,
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: function() {
                box.destroy();
            }
        });

        _this1.tweens.add({
            targets: product,
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            alpha: 1,
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: function() {
                if(data.result == 'correct'){
                    var s = Math.round(1000 / Math.pow(1.08, data.delta_time/1000));
                    _this1.score += s>0? s : 0;
                }
                _this1.sound.play(data.result);
                // _this1.tweens.add({
                //     targets: t,
                //     scale: 0.66,
                //     alpha: 0,
                //     ease: 'Cubic', 
                //     duration: 600,
                //     repeat: 0,
                //     yoyo: false,
                //     onComplete: function() {
                //         t.destroy();
                //         if(_this1.already_end){
                //             _this1.finish();
                //         }
                //     }
                // });
            }
        });
    },

    create_box: function(question) {
        // CREATE BOX WITH GIVEN QUESTION
        this.questionGiven += 1;
        var xp = Phaser.Math.Between(100, 500);
        var yp = Phaser.Math.Between(398, 622);
        var box = this.physics.add.image(xp, yp, 'box');
        box.scale = 1;
        box.depth = 4;
        //this.box.setVelocity(-600 / MAXTIME1 * 1000, 0);
        box.setBounce(1, 1);
        //this.box.setCollideWorldBounds(true);
        box.box_data = {}
        box.box_data.question = question;      // data{ question, answer, start_time, end_time }
        box.box_data.start_time = Date.now();
        box.setInteractive();
        this.boxes.add(box);

        this.input.setDraggable(box);
    },

    random_question: function() {
        // PRODUCE RANDOM QUESTION
        var n = Phaser.Math.Between(0, this.list.length-1);

        return this.list[n];
    },

    finish: function() {
        // END OF THE GAME
        this.scene.stop();
        var d = {}
        d.respondList = this.respondList;
        d.score = Math.round(this.score);
        d.username = this.username;
        d.gameType = '1';
        this.scene.add('postgame', Postgame);
        this.scene.start('postgame', d);
        //this.scene.switch('subgame');
    },

});