'use client';

import Konva from 'konva';

const BASE_SOL_PER_LEVEL = 10;
const MOOD_IMGS = ['/PiggySad.png', '/Piggy.png', '/PiggyHappy.png'];
const SOLANA_IMG = '/coin.png';
const TREASURE_IMG = '/Truhe.png';

type Options = {
    containerId: string;
    width: number;
    height: number;
    startTime: Date;
    endTime: Date;
    goal: number;
    payed: number;
    name: string;
    getCoinWorth: () => number;
    onPayment: (amount: number) => void;
};

export function initCanvas(options: Options) {
    let pig_width = options.width / 2.7;
    let pig_height = (pig_width / 200) * 137;

    let mood = 5;
    let level = 1;

    //Konva Stage
    const stage = new Konva.Stage({
        container: options.containerId,
        width: options.width,
        height: options.height,
    });

    var layer = new Konva.Layer();
    const serviceLayer = new Konva.Layer({
        listening: false,
    });

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
            y: -100,
            text: "+0 SOL",
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'green',
            visible: true,
        });

    //UTIL Piggy
    const feed = (sol: number) => {
        xp += (sol * 1.7 * mood) / 10;
        //mood = options.payed - (0 - options.startTime) * (options.goal / (options.endTime - options.startTime)); //TODO insert now for 0

        //Level Up
        let threshold = BASE_SOL_PER_LEVEL + Math.pow(level, 1.2);
        while (xp >= threshold) {
            xp -= threshold;
            level++;
        }
        piggy_img.src = MOOD_IMGS[Math.max(Math.floor(mood / 4), 0)];
        piggy_konva.image(piggy_img);
    };

    //Treasure
    let treasure_img = new Image();
    treasure_img.src = TREASURE_IMG;

    var treasure_konva = new Konva.Image({
        image: treasure_img,
        x: stage.width() - 130,
        y: 30,
        width: 100,
        height: 100,
    });

    //Coin
        let coin_img = new Image();
        coin_img.src = SOLANA_IMG;


        var coin_konva = new Konva.Image({
            image: coin_img,
            x: treasure_konva.x(),
            y: treasure_konva.y() + 100,
            width: 100,
            height: 100,
            draggable: true,
            visble: false,
        });
    
    //Speaking Bubble
        var balance_text = new Konva.Text({
            x: 0,
            y: 0,
            text: "100 SOL",
            fontSize: 22,
            fontFamily: 'Calibri',
            fill: '#555',
            width: 300,
            padding: 20,
            align: 'center',
            visible: false,
        });

        var balance_bubble = new Konva.Rect({
            x: 20,
            y: 60,
            stroke: '#555',
            strokeWidth: 5,
            fill: '#aaa',
            width: 300,
            height: 100,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
            cornerRadius: 10,
            visible: false,
        });

    // Sledge
        var sledge_img = new Image();
        sledge_img.src = '/Sledge.png';

        var sledge_konva = new Konva.Image({
            image: sledge_img,
            x: 0,
            y: stage.getHeight()/2-200/2,
            width: 400/3,
            height: 600/3,
            draggable: true,
            visble: false,
        });

    //Cursor styling
        let pre_move_x = coin_konva.x();
        let pre_move_y = coin_konva.y();
        coin_konva.on('mouseover', function () {
            document.body.style.cursor = 'grab';
        });
        coin_konva.on('click', function () {
            coin_konva.hide();
        });
        treasure_konva.on('click', function () {
            coin_konva.show();
        });
        treasure_konva.on('mouseenter', function () {
            document.body.style.cursor = 'pointer';
        });
        treasure_konva.on('mouseleave', function () {
            document.body.style.cursor = 'default';
        });
        coin_konva.on('dragend', function () {
            if((coin_konva.x()+coin_konva.getWidth()) > piggy_konva.x() && (coin_konva.x()+30/450*piggy_konva.width()) < piggy_konva.x() + piggy_konva.width() && (coin_konva.y() + coin_konva.getHeight()-60/450*piggy_konva.height()) > piggy_konva.y() && (coin_konva.y()+40) < piggy_konva.y() + piggy_konva.height()){
                payment_text.text('+' + options.getCoinWorth() + ' SOL');
                payment_text.setPosition({ x: coin_konva.x() + coin_konva.width()/2, y: coin_konva.y() + coin_konva.height()/2 });
                payment_text.visible = true;
                //TODO insert feed here
            }

            if(options.payed >= options.goal || true){
                sledge_konva.show();
            }
            
            coin_konva.setPosition({ x: pre_move_x, y: pre_move_y });
            coin_konva.hide();
            document.body.style.cursor = 'default';
        });
        coin_konva.on('mouseleave', function () {
            document.body.style.cursor = 'default';
        });
        piggy_konva.on('mouseover', function () {
            balance_text.text("Oink Oink!\n I currently store: 10000" + options.payed + " SOL for you!");
            balance_text.setPosition({ x: piggy_konva.x() - 3*piggy_konva.width()/5, y: piggy_konva.y() + piggy_konva.height()/9});
            balance_bubble.setPosition({ x: piggy_konva.x() - 3*piggy_konva.width()/5, y: piggy_konva.y() + piggy_konva.height()/9});
            balance_bubble.show();
            balance_text.visible(true);
            document.body.style.cursor = 'crosshair';
        });
        piggy_konva.on('mouseleave', function () {
            balance_bubble.hide();
            balance_text.visible(false);
            document.body.style.cursor = 'default';
        });
        sledge_konva.on('mouseover', function () {
            document.body.style.cursor = 'grab';
        });
        sledge_konva.on('dragend', function () {
            if((sledge_konva.x()+sledge_konva.getWidth()) > piggy_konva.x() && (sledge_konva.x()+30/450*piggy_konva.width()) < piggy_konva.x() + piggy_konva.width() && (sledge_konva.y() + sledge_konva.getHeight()-60/450*piggy_konva.height()) > piggy_konva.y() && (sledge_konva.y()+40) < piggy_konva.y() + piggy_konva.height()){
                //DO STUFF
                sledge_konva.hide();
                document.body.style.cursor = 'default';
            }
        });
        sledge_konva.on('mouseleave', function () {
            document.body.style.cursor = 'default';
        });

    //Staging
        layer.add(piggy_konva);
        layer.add(treasure_konva);
        layer.add(coin_konva);
        layer.add(sledge_konva);
        stage.add(layer);
        
        serviceLayer.add(payment_text);
        serviceLayer.add(balance_bubble);
        serviceLayer.add(balance_text);
        stage.add(serviceLayer);
        

    //Animation
    let acceleration = 1.3;
    let speed = -0.5;

    var anim = new Konva.Animation(function (frame) {
        payment_text.y(payment_text.y() + Math.max(speed * acceleration, -10));
        acceleration += 0.1;
    }, serviceLayer);

    anim.start();

    //Expose Functionality
    return {
        setDimensions: (width: number, height: number) => {
            stage.width(width);
            stage.height(height);
        },
    };
}
