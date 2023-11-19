import { Saving } from '@/service';
import { lastDayOfDecade } from 'date-fns';
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
    private mood = 5;
    private img: HTMLImageElement;
    private level = 1;
    private saving: Saving;
    private textElement: Text;
    private bubblesElement: Rect;

    constructor(
        width: number,
        height: number,
        x: number,
        y: number,
        saving: Saving
    ) {
        this.img = new Image();
        this.img.src = Pig.MOOD_IMGS[Math.max(Math.floor(this.mood / 4), 0)];
        this.saving = saving;

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
    }

    feed(amount: number) {
        this.xp += (amount * 1.7 * this.mood) / 10;
        this.mood = this.saving.paid / (Date.now() - this.saving.startDate.getDate()) * (this.saving.goal / (this.saving.paymentDate.getDate() - this.saving.paymentDate.getDate()));

        //Level Up
        let threshold = Pig.BASE_SOL_PER_LEVEL + Math.pow(this.level, 1.2);
        while (this.xp >= threshold) {
            this.xp -= threshold;
            this.level++;
        }

        const img = new Image();
        img.src = Pig.MOOD_IMGS[Math.max(Math.floor(this.mood / 4), 0)];
        this.element.image(img);
    }

    mount(layer: Layer) {
        layer.add(this.element);
    }

    mountService(layer: Layer) {
        layer.add(this.bubblesElement);
        layer.add(this.textElement);
    }
}
