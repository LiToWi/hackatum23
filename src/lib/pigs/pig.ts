import { Saving } from '@/service';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { type Image as KonvaImage } from 'konva/lib/shapes/Image';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';

export class Pig {
    private static MOOD_IMGS = [
        '/PiggySad.png',
        '/Piggy.png',
        '/PiggyHappy.png',
    ];
    private static BASE_SOL_PER_LEVEL = 10;

    public element: KonvaImage;
    private xp = 0;
    private mood = 2;
    private img: HTMLImageElement;
    private level = 1;
    private saving: Saving;
    private textElement: Text;
    private bubblesElement: Rect;
    private layer: Layer;
    private serviceLayer: Layer;

    constructor(
        width: number,
        height: number,
        x: number,
        y: number,
        saving: Saving,
        layer: Layer,
        serviceLayer: Layer
    ) {
        this.img = new Image();
        this.img.src = Pig.MOOD_IMGS[Math.max(Math.floor(this.mood / 4), 0)];
        this.saving = saving;
        this.layer = layer;
        this.serviceLayer = serviceLayer;

        this.element = new Konva.Image({
            image: this.img,
            x,
            y,
            width,
            height,
        });

        // balance text
        this.textElement = new Konva.Text({
            x: 0,
            y: 0,
            text: '100 SOL',
            fontSize: 22,
            fontFamily: 'Calibri',
            fill: '#555',
            width: 300,
            padding: 20,
            align: 'center',
            visible: false,
        });
        this.bubblesElement = new Konva.Rect({
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

        this.element.on('mousedown', () => {
            this.textElement.text(
                'Oink Oink!\n I currently store: ' +
                    this.saving.paid +
                    ' SOL for you!'
            );
            this.textElement.setPosition({
                x: this.element.x() - (3 * this.element.width()) / 5,
                y: this.element.y() + this.element.height() / 9,
            });
            this.bubblesElement.setPosition({
                x: this.element.x() - (3 * this.element.width()) / 5,
                y: this.element.y() + this.element.height() / 9,
            });
            this.bubblesElement.show();
            this.textElement.visible(true);

            setTimeout(() => {
                this.bubblesElement.hide();
                this.textElement.visible(false);
            }, 2000);
        });
        this.element.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        this.element.on('mouseleave', () => {
            document.body.style.cursor = 'default';
        });

        this.layer.add(this.element);
        this.serviceLayer.add(this.bubblesElement);
        this.serviceLayer.add(this.textElement);
    }

    feed(amount: number) {
        this.xp += (amount * 1.7 * this.mood) / 10;
        this.mood++;

        let threshold = Pig.BASE_SOL_PER_LEVEL + Math.pow(this.level, 1.2);
        while (this.xp >= threshold) {
            this.xp -= threshold;
            this.level++;
        }

        let img = new Image();
        img.onload = () => this.element.image(img);
        img.src = Pig.MOOD_IMGS[Math.max(Math.floor(this.mood / 4), 0)];

        this.saving.paid += amount;

    }

    break() {
        const group = new Konva.Group({
            x: this.element.x(),
            y: this.element.y(),
            rotation: 20,
        });

        const img1 = new Image();
        img1.src = '/BrokenPiggy1.png';
        const shard1 = new Konva.Image({
            image: img1,
            x: -25,
            y: -25,
            width: (3 * this.element.width()) / 5,
            height: (9 * this.element.height()) / 10,
            rotation: 20,
        });
        const img2 = new Image();
        img2.src = '/BrokenPiggy2.png';
        const shard2 = new Konva.Image({
            image: img2,
            x: 50,
            y: 100,
            width: (2 * this.element.width()) / 3,
            height: (2 * this.element.height()) / 3,
            rotation: -50,
        });
        const img3 = new Image();
        img3.src = '/BrokenPiggy3.png';
        const shard3 = new Konva.Image({
            image: img3,
            x: -19,
            y: 15,
            width: (3 * this.element.width()) / 5,
            height: (2 * this.element.height()) / 3,
        });
        group.add(shard3, shard2, shard1);

        const random = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const img = new Image();
        img.src = '/coin.png';
        for (let i = 0; i < 30; i++) {
            const size = random(
                (1 / 10) * this.element.width(),
                (1 / 3) * this.element.width()
            );
            const coin = new Konva.Image({
                image: img,
                x: random(-25, 150),
                y: random(-35, 55),
                width: size,
                height: size,
            });
            group.add(coin);
        }

        this.layer.add(group);

        this.element.destroy();
    }
}
