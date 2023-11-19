'use client';

import Konva from 'konva';
import { Pig } from './pig';
import { Saving } from '@/service';

const SOLANA_IMG = '/coin.png';
const TREASURE_IMG = '/Truhe.png';

type Options = {
    savings: Saving[];
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
    onAdd: () => void;
};

export function initCanvas(options: Options) {
    let pig_width = options.width / 2.7;
    let pig_height = (pig_width / 200) * 137;

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

    // Text
    var payment_text = new Konva.Text({
        //TODO customize
        x: stage.width() / 2,
        y: -100,
        text: '+0 SOL',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green',
        visible: true,
    });

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

    // Sledge
    var sledge_img = new Image();
    sledge_img.src = '/Sledge.png';

    var sledge_konva = new Konva.Image({
        image: sledge_img,
        x: 0,
        y: stage.height() / 2 - 200 / 2,
        width: 400 / 3,
        height: 600 / 3,
        draggable: true,
        visble: false,
    });

    const pig = new Pig(
        pig_width,
        pig_height,
        stage.width() / 2 - pig_width / 2,
        stage.height() / 2 - pig_height / 2,
        options.savings[0]
    );

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
        if (
            coin_konva.x() + coin_konva.getWidth() > pig.element.x() &&
            coin_konva.x() + (30 / 450) * pig.element.width() <
                pig.element.x() + pig.element.width() &&
            coin_konva.y() +
                coin_konva.getHeight() -
                (60 / 450) * pig.element.height() >
                pig.element.y() &&
            coin_konva.y() + 40 < pig.element.y() + pig.element.height()
        ) {
            payment_text.text('+' + options.getCoinWorth() + ' SOL');
            payment_text.setPosition({
                x: coin_konva.x() + coin_konva.width() / 2,
                y: coin_konva.y() + coin_konva.height() / 2,
            });
            payment_text.visible(true);
            //TODO insert feed here
        }

        if (options.payed >= options.goal || true) {
            sledge_konva.show();
        }

        coin_konva.setPosition({ x: pre_move_x, y: pre_move_y });
        coin_konva.hide();
        document.body.style.cursor = 'default';
    });
    coin_konva.on('mouseleave', function () {
        document.body.style.cursor = 'default';
    });
    sledge_konva.on('mouseover', function () {
        document.body.style.cursor = 'grab';
    });
    sledge_konva.on('dragend', function () {
        if (
            sledge_konva.x() + sledge_konva.getWidth() > pig.element.x() &&
            sledge_konva.x() + (30 / 450) * pig.element.width() <
                pig.element.x() + pig.element.width() &&
            sledge_konva.y() +
                sledge_konva.getHeight() -
                (60 / 450) * pig.element.height() >
                pig.element.y() &&
            sledge_konva.y() + 40 < pig.element.y() + pig.element.height()
        ) {
            //DO STUFF
            sledge_konva.hide();
            document.body.style.cursor = 'default';
        }
    });
    sledge_konva.on('mouseleave', function () {
        document.body.style.cursor = 'default';
    });

    const add = new Konva.Rect({
        x: 20,
        y: 60,
        stroke: '#555',
        strokeWidth: 5,
        fill: '#aaa',
        width: 300,
        height: 100,
    });
    add.addEventListener('click', () => {
        options.onAdd();
    });

    //Staging
    pig.mount(layer);
    layer.add(treasure_konva);
    layer.add(coin_konva);
    layer.add(sledge_konva);
    layer.add(add);
    stage.add(layer);

    pig.mountService(serviceLayer);
    serviceLayer.add(payment_text);
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
