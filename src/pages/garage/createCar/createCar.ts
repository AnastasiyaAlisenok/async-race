import { Cars, ElementsArgs } from '../../../types/types';
import ElementCreator from '../../../utils/elementCreator';
import View from '../../../utils/view';
import carImage from '../../../assets/img/car-img-code';
import flagImage from '../../../assets/img/flag.svg';
import checkElement from '../../../utils/checkElement';
import './createCar.scss';
import { deleteCar, deleteWinner, getCar, getWinners, updateCar } from '../../api/api-requests';
import CarsGarage from '../cars-garage/carsGarage';
import GaragePage from '../garage';
import PanelControl from '../panel-control/panelControl';
import { Order, SortBy } from '../../winners/winnersPage';

const carContainerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['car__container'],
    textContent: '',
};

const buttonSelectArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__select'],
    textContent: 'Select',
};

const buttonRemoveArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__remove'],
    textContent: 'Remove',
};

const carNameArgs: ElementsArgs = {
    tag: 'span',
    classes: ['car__name'],
    textContent: '',
};

const carWrapperArgs: ElementsArgs = {
    tag: 'div',
    classes: ['car'],
    textContent: '',
};

const buttonStartArgs: ElementsArgs = {
    tag: 'button',
    classes: ['car__button', 'car__button-start'],
    textContent: 'A',
};

const buttonStopArgs: ElementsArgs = {
    tag: 'button',
    classes: ['car__button', 'car__button-stop'],
    textContent: 'B',
};

const carArgs: ElementsArgs = {
    tag: 'div',
    classes: ['car__image'],
    textContent: '',
};

const flagArgs: ElementsArgs = {
    tag: 'img',
    classes: ['flag'],
    textContent: '',
};

const containerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['car__wrapper'],
    textContent: '',
};

export default class CreateCar extends View {
    public static id: number;

    constructor() {
        super(carContainerArgs);
    }

    public createElements(name: string, color: string, id: number): void {
        const buttonSelect = new ElementCreator(buttonSelectArgs);
        (checkElement(buttonSelect.getElement()) as HTMLElement).dataset.select = `${id}`;
        buttonSelect.getElement()?.addEventListener('click', CreateCar.selectCar);
        const buttonRemove = new ElementCreator(buttonRemoveArgs);
        (checkElement(buttonRemove.getElement()) as HTMLElement).dataset.delete = `${id}`;
        buttonRemove.getElement()?.addEventListener('click', CreateCar.removeCar);
        const carName = new ElementCreator(carNameArgs);
        checkElement(carName.getElement()).textContent = name;
        checkElement(carName.getElement()).id = `name-${id}`;
        const carWrapper = new ElementCreator(carWrapperArgs);
        const buttonStart = new ElementCreator(buttonStartArgs).getElement() as HTMLElement;
        buttonStart.id = `start-${id}`;
        buttonStart.addEventListener('click', GaragePage.startRace);
        const buttonStop = new ElementCreator(buttonStopArgs).getElement() as HTMLButtonElement;
        buttonStop.id = `stop-${id}`;
        buttonStop.disabled = true;
        buttonStop.addEventListener('click', GaragePage.stopRace);
        const container = new ElementCreator(containerArgs);
        const car = new ElementCreator(carArgs).getElement() as HTMLElement;
        car.innerHTML = carImage;
        const svg = car.firstChild as HTMLElement;
        svg?.setAttribute('fill', color);
        svg.id = `car-${id}`;
        const flag = new ElementCreator(flagArgs).getElement() as HTMLImageElement;
        flag.src = flagImage;
        container.addInnerHtml(car);
        container.addInnerHtml(flag);
        carWrapper.addInnerHtml(buttonStart);
        carWrapper.addInnerHtml(buttonStop);
        carWrapper.addInnerHtml(container.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(buttonSelect.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(buttonRemove.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(carName.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(carWrapper.getElement() as HTMLElement);
        (checkElement(this.viewElementCreator.getElement()) as HTMLElement).id = `${id}`;
    }

    public static removeCar(event: Event): void {
        const button = event.target as HTMLElement;
        const id = (checkElement(button) as HTMLElement).dataset.delete as string;
        deleteCar(id).then(() => {
            const car = document.getElementById(id);
            car?.remove();
        });
        const countCarsEl = checkElement(document.querySelector('.cars-container__count-cars'));
        CarsGarage.COUNT_CARS -= 1;
        countCarsEl.textContent = `(${CarsGarage.COUNT_CARS})`;
        GaragePage.renderPage();
        getWinners(CarsGarage.PAGE_NUMBER, CarsGarage.COUNT_CARS_ON_PAGE, SortBy.id, Order.asc).then((obj) => {
            Array.from(obj.winners).forEach((winner) => {
                if (winner.id === Number(id)) {
                    deleteWinner(id);
                }
            });
        });
    }

    public static selectCar(event: Event): void {
        const button = event.target as HTMLElement;
        const id = (checkElement(button) as HTMLElement).dataset.select as string;
        getCar(id).then((obj: Cars) => {
            const input = checkElement(document.querySelector('.update-cars__name')) as HTMLInputElement;
            input.value = obj.name;
            PanelControl.carNameUpdate = obj.name;
            const inputColor = checkElement(document.querySelector('.update-cars__color')) as HTMLInputElement;
            inputColor.value = obj.color;
            PanelControl.colorUpdate = obj.color;
            CreateCar.id = obj.id;
        });
    }

    public static updateCarInfo(): void {
        updateCar({ name: PanelControl.carNameUpdate, color: PanelControl.colorUpdate, id: CreateCar.id }).then(
            (obj: Cars) => {
                const carName = checkElement(document.getElementById(`name-${CreateCar.id}`));
                const carImg = document.getElementById(`car-${CreateCar.id}`);
                carName.textContent = obj.name;
                carImg?.removeAttribute('fill');
                carImg?.setAttribute('fill', obj.color);
                GaragePage.renderPage();
            }
        );
    }
}

