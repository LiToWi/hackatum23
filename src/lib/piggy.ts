'use client';

import Konva from 'konva';

const BASE_SOL_PER_LEVEL = 10;
const MOOD_IMGS = ['/Piggy.png', '/Piggy.png', '/PiggyHappy.png'];
const SOLANA_IMG = '/coin.png';

type Options = {
    containerId: string;
    level: number;
    mood: number;
    balance: number;
    width: number;
    height: number;
};

export function initCanvas(options: Options) {
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
    piggy_img.src = MOOD_IMGS[Math.floor(options.mood / 3)];
    var piggy_konva = new Konva.Image({
        image: piggy_img,
        x: stage.width() / 2 - 200 / 2,
        y: stage.height() / 2 - 137 / 2,
        width: 200,
        height: 137,
        draggable: false,
    });

    //UTIL Piggy
    const setMood = (newMood: number) => {
        options.mood = newMood;
    };
    const setLevel = (newLevel: number) => {
        options.level = newLevel;
    };
    const feed = (sol: number) => {
        xp += (sol * 1.7 * options.mood) / 10;
        options.mood = options.mood + sol <= 10 ? options.mood + sol : 10;

        //Level Up
        let threshold = BASE_SOL_PER_LEVEL + Math.pow(options.level, 1.2);
        if (xp >= threshold) {
            xp -= threshold;
            options.level++;
        }
    };

    //Coin
    let coin_img = new Image();
    coin_img.src = SOLANA_IMG;

    var coin_konva = new Konva.Image({
        image: coin_img,
        x: stage.width() / 2 - 200 / 2,
        y: stage.height() / 2 - 137 / 2,
        width: 200,
        height: 200,
        draggable: true,
    });

    // add cursor styling
    coin_konva.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    coin_konva.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });

    layer.add(coin_konva);
    layer.add(piggy_konva);
    stage.add(layer);

    //Expose Functionality
    return {
        setMood,
        setLevel,
        feed,
        setDimensions: (width: number, height: number) => {
            stage.width(width);
            stage.height(height);
        },
    };
}
