import { carBrands, models } from '../pages/car-brands/car-brands';

const INDEX = 0;
const COLOR_LENGTH = 6;

function getRandomIndex(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomName(): string {
    const brand = carBrands[getRandomIndex(INDEX, carBrands.length - 1)];
    const model = models[getRandomIndex(INDEX, models.length - 1)];
    return `${brand} ${model}`;
}

function randomColor(): string {
    const hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    let color = '#';
    for (let i = 0; i < COLOR_LENGTH; i += 1) {
        const element = hex[getRandomIndex(INDEX, hex.length - 1)];
        color += element;
    }
    return color;
}

export { randomName, randomColor };
