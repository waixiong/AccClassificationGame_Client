var _postgame;

var Postgame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Postgame ()
    {
        Phaser.Scene.call(this, { key: 'postgame' });
    },

    init: function (data) 
    {
        this.respondList = data.respondList;
        this.score = data.score;
        this.username = data.username;
        
        this.stat = { '1': 0, '2': 0, '3':0 };
        this.timestamp = 0;
        this.index_now = 0;
        this.displayscore = 0;
    },

    create: function ()
    {
        _postgame = this;

        this.scene.remove('game');
        var scoreText = this.add.text(0, 0, this.username + '\nYour score is', { fontFamily: 'customfont', fontSize: '40px', color:'#fff', align:'center'});
        this.scoreNum = this.add.text(0, 0, this.displayscore, { fontFamily: 'customfont', fontSize: '80px', color:'#fff'});
        scoreText.x = 300 - scoreText.width/2;
        scoreText.y = 300 - scoreText.height/2;
        this.scoreNum.x = 300 - this.scoreNum.width/2;
        this.scoreNum.y = 400 - this.scoreNum.height/2;

        var exitButton = this.add.text(0, 0, 'Exit', { fontFamily: 'customfont', fontSize: '30px', color:'#fff'});
        exitButton.x = 300 - exitButton.width/2;
        exitButton.y = 600 - exitButton.height/2;

        this.data1 = this.add.text(0, 0, 'Correct   : 0', { fontFamily: 'customfont', fontSize: '25px', color:'#fff'});
        this.data1.x = 300 - this.data1.width/2;
        this.data1.y = 470 - this.data1.height/2;

        this.data2 = this.add.text(0, 0, 'Wrong     : 0', { fontFamily: 'customfont', fontSize: '25px', color:'#fff'});
        this.data2.x = 300 - this.data2.width/2;
        this.data2.y = 510 - this.data2.height/2;

        this.data3 = this.add.text(0, 0, 'No answer : 0', { fontFamily: 'customfont', fontSize: '25px', color:'#fff'});
        this.data3.x = 300 - this.data3.width/2;
        this.data3.y = 550 - this.data3.height/2;

        // SET BUTTON
        exitButton.setInteractive();
        exitButton.on("pointerover", () => {
            //indicatorText.x = 300 - indicatorText.width/2;
            //indicatorText.y = 636 - indicatorText.height/2;
            //indicatorText.setVisible(true);
        })
        exitButton.on("pointerout", () => {
            //indicatorText.setVisible(false);
        })
        exitButton.on("pointerup", () => {
            console.log("EXIT");
            this.scene.stop();
            this.scene.start('menu');
        })

        var flash_tween = _postgame.tweens.add({
            targets: exitButton,
            ease: 'Cubic',
            alpha : 0,
            duration: 500,
            repeat: 0,
            yoyo: false,
            onComplete: function() {
                _postgame.tweens.add({
                    targets: exitButton,
                    ease: 'Cubic',
                    alpha : 1,
                    duration: 500,
                    repeat: 0,
                    yoyo: false,
                    onComplete: function() {
                        flash_tween.restart();
                    }
                });
            }
        });

        // var indicatorText = this.add.text(0, 0, '>        <', { fontFamily: 'customfont', fontSize: '60px', color:'#fff'});
        // indicatorText.x = 300 - indicatorText.width/2;
        // indicatorText.y = 450 - indicatorText.height/2;
        // indicatorText.setVisible(false);
    },

    update: function(time, delta) {
        this.timestamp += delta;
        if(Math.floor(this.timestamp / 50) > this.index_now ) {
            if(this.index_now < this.respondList.length){
                if(this.respondList[this.index_now].result == null){
                    this.stat['3'] ++;
                }else if(this.respondList[this.index_now].result == 'correct'){
                    this.stat['1'] ++;
                }else{
                    this.stat['2'] ++;
                }
                
                if(this.stat['1'] / 10 < 1){
                    this.data1.text = 'Correct   : ' + this.stat['1'];
                }else{
                    this.data1.text = 'Correct   :' + this.stat['1'];
                }
                this.data1.x = 300 - this.data1.width/2;
                
                if(this.stat['2'] / 10 < 1){
                    this.data2.text = 'Wrong     : ' + this.stat['2'];
                }else{
                    this.data2.text = 'Wrong     :' + this.stat['2'];
                }
                this.data2.x = 300 - this.data2.width/2;
                
                if(this.stat['3'] / 10 < 1){
                    this.data3.text = 'No answer : ' + this.stat['3'];
                }else{
                    this.data3.text = 'No answer :' + this.stat['3'];
                }
                this.data3.x = 300 - this.data3.width/2;
            }
            this.index_now ++;
        }
        if(this.timestamp < 1000){
            this.displayscore = Math.round(this.score * this.timestamp / 1000);
        }else{
            this.displayscore = this.score;
        }
        this.scoreNum.text = this.displayscore.toString();
        this.scoreNum.x = 300 - this.scoreNum.width/2;
    }

});