'use client';

import Konva from 'konva';

const BASE_SOL_PER_LEVEL = 10;
const MOOD_IMGS = ['/PiggySad.png', '/Piggy.png', '/PiggyHappy.png'];
const SOLANA_IMG = '/coin.png';

type Options = {
    containerId: string,
    width: number,
    height: number,
    startTime: number,
    endTime: number,
    goal: number,
    getBalance: () => number,
    getCoinWorth: () => number,
    onPayment: (amount: number) => void,
};

export function initCanvas(options: Options) {
    let pig_width = options.width / 2.7;
    let pig_height = pig_width/200*137;

    let mood = 5;
    let level = 1;

    //Konva Stage
        const stage = new Konva.Stage({
            container: options.containerId,
            width: options.width,
            height: options.height,
        });

        var layer = new Konva.Layer();

    //Piggy
        let piggy_img = new Image();
        let xp = 0;
        piggy_img.src = MOOD_IMGS[Math.max(Math.floor(mood / 4), 0)];
        var piggy_konva = new Konva.Image({
            image: piggy_img,
            x: stage.width() / 2 - pig_width / 2,
            y: stage.height() / 2 - pig_height / 2,
            width: pig_width,
            height: pig_height,
            draggable: false,
        });

    // Text
        var payment_text = new Konva.Text({//TODO customize
            x: stage.width() / 2,
            y: 15,
            text: "+0 SOL",
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'green',
            visible: false,
            opacity: 1,
        });

    //UTIL Piggy
        const feed = (sol: number) => {
            xp += (sol * 1.7 * mood) / 10;
            mood = options.getBalance() - ((0 - options.startTime) * (options.goal / (options.endTime - options.startTime))); //TODO insert now for 0

            //Level Up
            let threshold = BASE_SOL_PER_LEVEL + Math.pow(level, 1.2);
            while (xp >= threshold) {
                xp -= threshold;
                level++;
            }
            piggy_img.src = MOOD_IMGS[Math.max(Math.floor(mood / 4), 0)];
            piggy_konva.image(piggy_img);
        };

    //Coin
        let coin_img = new Image();
        coin_img.src = SOLANA_IMG;

        var coin_konva = new Konva.Image({
            image: coin_img,
            x: stage.width() - 130,
            y: 30,
            width: 100,
            height: 100,
            draggable: true,
        });

    // add cursor styling
        let pre_move_x = coin_konva.x();
        let pre_move_y = coin_konva.y();
        coin_konva.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        coin_konva.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });
        coin_konva.on('dragend', function () {
            if((coin_konva.x()+coin_konva.getWidth()) > piggy_konva.x() && (coin_konva.x()+30/450*piggy_konva.width()) < piggy_konva.x() + piggy_konva.width() && (coin_konva.y() + coin_konva.getHeight()-60/450*piggy_konva.height()) > piggy_konva.y() && (coin_konva.y()+40) < piggy_konva.y() + piggy_konva.height()){
                //DO STUFF
                payment_text.setPosition({ x: coin_konva.x() + coin_konva.width()/2, y: coin_konva.y() + coin_konva.height()/2 });
                payment_text.visible(true);
                for(let i = 0; i < 1000; i++){
                    payment_text.opacity(payment_text.opacity() - 0.01);
                    payment_text.y(payment_text.y() - 0.1);
                }

            }
            coin_konva.setPosition({ x: pre_move_x, y: pre_move_y });
        });

    //Staging
        layer.add(piggy_konva);
        layer.add(coin_konva);
        layer.add(payment_text);
        stage.add(layer);


    //Animation
        let acceleration = 1.3;
        let speed = -0.5;

        var anim = new Konva.Animation(function (frame) {
        payment_text.y(
            payment_text.y() + Math.max(speed * acceleration, -10)
        );
        acceleration += 0.1;
        }, layer);

        anim.start();

    //Expose Functionality
        return {
            setDimensions: (width: number, height: number) => {
                stage.width(width);
                stage.height(height);
            },
        };
}
