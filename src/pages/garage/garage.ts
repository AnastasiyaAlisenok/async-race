import { createWinner, getCars, getWinner, getWinners, setDrive, setEngine, updateWinner } from '../api/api-requests';
import CarsGarage from './cars-garage/carsGarage';
import Footer from './footer/footer';
import HeaderGarage from './header/header';
import PanelControl from './panel-control/panelControl';
import { CarsResponse, ElementsArgs, EngineInfo, RaceInfo, Animation } from '../../types/types';
import checkElement from '../../utils/checkElement';
import ElementCreator from '../../utils/elementCreator';
import { SortBy, Order, WinnersPage } from '../winners/winnersPage';
import ModalWindow from './modal-window/modalWindow';

const enum Status {
    start = 'started',
    stop = 'stopped',
    drive = 'drive',
}

const garageContainerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['page__garage', 'visible'],
    textContent: '',
};

export default class GaragePage {
    public static garage: HTMLElement | null;

    public static animation: Animation[];

    public static RACES_INFO: RaceInfo[] = [];

    public static winnerId: number;

    public static winnerTime: number;

    public static success = false;

    public header: HeaderGarage;

    public panelControl: PanelControl;

    public carsGarage: CarsGarage;

    public footer: Footer;

    constructor() {
        this.header = new HeaderGarage();
        this.panelControl = new PanelControl();
        this.carsGarage = new CarsGarage();
        this.footer = new Footer();
    }

    public createView(): void {
        const garagePage = new ElementCreator(garageContainerArgs);
        GaragePage.garage = garagePage.getElement();
        garagePage.addInnerHtml(this.panelControl.getHtmlElement() as HTMLElement);
        garagePage.addInnerHtml(this.carsGarage.getHtmlElement() as HTMLElement);
        garagePage.addInnerHtml(this.footer.getHtmlElement() as HTMLElement);
        document.body.append(this.header.getHtmlElement() as HTMLElement);
        document.body.append(garagePage.getElement() as HTMLElement);
    }

    public static clickNext(): void {
        CarsGarage.PAGE_NUMBER += 1;
        const buttonPrev = checkElement(document.querySelector('.button__prev')) as HTMLButtonElement;
        buttonPrev.disabled = false;
        GaragePage.renderPage();
    }

    public static clickPrev(): void {
        CarsGarage.PAGE_NUMBER -= 1;
        const buttonNext = checkElement(document.querySelector('.button__next')) as HTMLButtonElement;
        buttonNext.disabled = false;
        GaragePage.renderPage();
    }

    public static renderPage(): void {
        getCars(CarsGarage.PAGE_NUMBER, CarsGarage.COUNT_CARS_ON_PAGE).then((obj: CarsResponse) => {
            CarsGarage.COUNT_CARS = Number(obj.count);
            const garage = document.querySelector('.cars-container');
            garage?.remove();
            const garageUpdate = new CarsGarage();
            const footer = document.querySelector('.footer');
            footer?.remove();
            const newFooter = new Footer();
            GaragePage.garage?.append(garageUpdate.getHtmlElement() as HTMLElement);
            GaragePage.garage?.append(newFooter.getHtmlElement() as HTMLElement);
        });
    }

    public static startRace(event: Event): void {
        GaragePage.RACES_INFO = [];
        const button = event.target as HTMLButtonElement;
        const idApi = Number(button.id.replace(/start-/, ''));
        const status = Status.start;
        const buttonStop = checkElement(document.getElementById(`stop-${idApi}`)) as HTMLButtonElement;
        buttonStop.disabled = false;
        button.disabled = true;
        GaragePage.startMove(idApi, status);
    }

    public static stopRace(event: Event): void {
        const button = event.target as HTMLButtonElement;
        const idApi = Number(button.id.replace(/stop-/, ''));
        const status = Status.stop;
        const buttonStart = checkElement(document.getElementById(`start-${idApi}`)) as HTMLButtonElement;
        buttonStart.disabled = false;
        button.disabled = true;
        GaragePage.stopMove(idApi, status);
    }

    public static stopMove(idCar: number, status: string): void {
        const id = `car-${idCar}`;
        const car = checkElement(document.getElementById(id)) as HTMLElement;
        const position = 0;
        setEngine(idCar, status).then(() => {
            car.style.marginLeft = `${position}`;
            const arrAnimation = GaragePage.animation.filter((el) => el.id === Number(idCar));
            arrAnimation.forEach((el) => window.cancelAnimationFrame(el.animate));
        });
    }

    public static startMove(idCar: number, status: string): void {
        GaragePage.animation = [];
        const id = `car-${idCar}`;
        const car = checkElement(document.getElementById(id)) as HTMLElement;
        setEngine(idCar, status).then((obj: EngineInfo) => {
            if (typeof obj === 'object' && obj !== null) {
                const { distance, velocity } = obj;
                GaragePage.startAnimation(distance, velocity, car, idCar);
                GaragePage.switchDrive(idCar);
            }
        });
    }

    public static startAnimation(distanceValue: number, velocityValue: number, car: HTMLElement, idCar: number): void {
        let position = 0;
        const msInSeconds = 1000;
        const percentOtherElems = GaragePage.setPercentageOfElems();
        const widthOthersElems = percentOtherElems * window.innerWidth;
        const widthCar = 80;
        const frame = 200;
        const width = window.innerWidth - widthOthersElems;
        const time = distanceValue / velocityValue / msInSeconds;
        const step = (width - widthCar) / time / frame;
        let animation: number;
        function animate(): void {
            position += step;
            const carElement = car;
            carElement.style.marginLeft = `${position}px`;
            if (position < width - step) {
                animation = window.requestAnimationFrame(animate);
                const animateInfo = { animate: animation, id: idCar };
                GaragePage.animation.push(animateInfo);
            } else {
                const buttonReset = checkElement(document.querySelector('.button__reset')) as HTMLButtonElement;
                if (buttonReset.disabled) {
                    GaragePage.determineWinner();
                    const modal = new ModalWindow();
                    modal.createView();
                    document.body.append(modal.getHtmlElement() as HTMLElement);
                    buttonReset.disabled = false;
                    setTimeout(() => {
                        (modal.getHtmlElement() as HTMLElement)?.remove();
                    }, 4000);
                }
            }
        }
        animation = window.requestAnimationFrame(animate);
    }

    public static switchDrive(idCar: number): void {
        setDrive(idCar, Status.drive).then((answer) => {
            if (answer.success === false) {
                const arrAnimation = GaragePage.animation.filter((el) => el.id === idCar);
                arrAnimation.forEach((el) => window.cancelAnimationFrame(el.animate));
            }
        });
    }

    public static switchDriveRace(idCar: number): void {
        setDrive(idCar, Status.drive).then((answer) => {
            if (answer.success === true) {
                const index = GaragePage.RACES_INFO.findIndex((el) => el.id === answer.idCar);
                GaragePage.RACES_INFO[index].success = true;
            } else if (answer.success === false) {
                const index = GaragePage.RACES_INFO.findIndex((el) => el.id === answer.idCar);
                GaragePage.RACES_INFO[index].success = false;
                const arrAnimation = GaragePage.animation.filter((el) => el.id === idCar);
                arrAnimation.forEach((el) => window.cancelAnimationFrame(el.animate));
            }
        });
    }

    public static async clickRace(): Promise<void> {
        GaragePage.animation = [];
        GaragePage.RACES_INFO = [];
        GaragePage.disableStop();
        const buttonPrev = document.querySelector('.page__garage .button__prev') as HTMLButtonElement;
        const buttonNext = document.querySelector('.page__garage .button__next') as HTMLButtonElement;
        buttonPrev.disabled = true;
        buttonNext.disabled = true;
        const status = Status.start;
        getCars(CarsGarage.PAGE_NUMBER, CarsGarage.COUNT_CARS_ON_PAGE).then((obj: CarsResponse) => {
            Promise.all(obj.cars).then((cars) => {
                const arrEngineInfo: Promise<EngineInfo>[] = [];
                const arrId: number[] = [];
                Array.from(cars).forEach((car) => {
                    const engineInfo: Promise<EngineInfo> = setEngine(car.id, status);
                    arrEngineInfo.push(engineInfo);
                    arrId.push(car.id);
                });
                Promise.all(arrEngineInfo).then((array) => {
                    Array.from(array).forEach((object, index) => {
                        const { distance, velocity } = object;
                        const msInSeconds = 1000;
                        const timeRace = distance / velocity / msInSeconds;
                        GaragePage.RACES_INFO.push({ id: arrId[index], time: timeRace });
                        const car = checkElement(document.getElementById(`car-${arrId[index]}`)) as HTMLElement;
                        GaragePage.startAnimation(distance, velocity, car, arrId[index]);
                        GaragePage.switchDriveRace(arrId[index]);
                    });
                });
            });
        });
    }

    public static clickReset(): void {
        const buttonPrev = document.querySelector('.page__garage .button__prev') as HTMLButtonElement;
        const buttonNext = document.querySelector('.page__garage .button__next') as HTMLButtonElement;
        buttonPrev.disabled = false;
        buttonNext.disabled = false;
        GaragePage.disableStart();
        const status = Status.start;
        getCars(CarsGarage.PAGE_NUMBER, CarsGarage.COUNT_CARS_ON_PAGE).then((obj: CarsResponse) => {
            Promise.all(obj.cars).then((cars) => {
                Array.from(cars).forEach((car) => {
                    GaragePage.stopMove(car.id, status);
                });
            });
        });
    }

    private static determineWinner(): void {
        const winnerCar = GaragePage.setWinner();
        const winnerId = winnerCar.id;
        GaragePage.winnerId = winnerId;
        const winnerTime = Number(winnerCar.time.toFixed(2));
        GaragePage.winnerTime = winnerTime;
        getWinners(CarsGarage.PAGE_NUMBER, CarsGarage.COUNT_CARS_ON_PAGE, SortBy.id, Order.asc).then((obj) => {
            const isWinnerExist: boolean = Array.from(obj.winners).every((winner) => winner.id !== winnerId);
            if (isWinnerExist) {
                const win = 1;
                createWinner({ id: winnerId, wins: win, time: winnerTime });
            } else {
                getWinner(winnerId).then((winner) => {
                    const winsCount = winner.wins + 1;
                    const timeBest = winnerTime < winner.time ? winnerTime : winner.time;
                    const idCar = winner.id;
                    updateWinner({ id: idCar, wins: winsCount, time: timeBest });
                });
            }
        });
    }

    public static renderWinnerPage(): void {
        const winnersContainer = document.querySelector('.page__winners');
        winnersContainer?.remove();
        const newWinnersContainer = new WinnersPage();
        newWinnersContainer.createView();
    }

    public static disableButtons(): void {
        if (CarsGarage.PAGE_NUMBER === CarsGarage.FIRST_PAGE) {
            const buttonPrev = document.querySelector('.page__garage .button__prev') as HTMLButtonElement;
            buttonPrev.disabled = true;
        }
        const lastPage = Math.ceil(Number(CarsGarage.COUNT_CARS) / CarsGarage.COUNT_CARS_ON_PAGE);
        if (CarsGarage.PAGE_NUMBER === lastPage) {
            const buttonNext = document.querySelector('.page__garage .button__next') as HTMLButtonElement;
            buttonNext.disabled = true;
        }
    }

    public static setPercentageOfElems(): number {
        let percentOtherElems = 0.18;
        if (window.innerWidth <= 1000 && window.innerWidth > 900) {
            percentOtherElems = 0.2;
        } else if (window.innerWidth <= 900 && window.innerWidth > 800) {
            percentOtherElems = 0.23;
        } else if (window.innerWidth <= 800 && window.innerWidth >= 700) {
            percentOtherElems = 0.28;
        } else if (window.innerWidth < 700 && window.innerWidth >= 500) {
            percentOtherElems = 0.33;
        }
        return percentOtherElems;
    }

    public static setWinner(): RaceInfo {
        let winnerCar = GaragePage.RACES_INFO.reduce((acc, v) => (acc.time < v.time ? acc : v));
        const winnerId = winnerCar.id;
        if (winnerCar.success === true) {
            GaragePage.winnerId = winnerId;
        } else {
            GaragePage.RACES_INFO = GaragePage.RACES_INFO.filter((cars) => cars.id !== winnerId);
            winnerCar = GaragePage.setWinner();
        }
        return winnerCar;
    }

    private static disableStop(): void {
        const buttonsStart = document.querySelectorAll('.car__button-start');
        buttonsStart.forEach((button) => {
            if (button instanceof HTMLButtonElement) {
                const buttonStart = button;
                buttonStart.disabled = true;
            }
        });
        const buttonsStop = document.querySelectorAll('.car__button-stop');
        buttonsStop.forEach((button) => {
            if (button instanceof HTMLButtonElement) {
                const buttonStop = button;
                buttonStop.disabled = false;
            }
        });
    }

    private static disableStart(): void {
        const buttonsStart = document.querySelectorAll('.car__button-start');
        buttonsStart.forEach((button) => {
            if (button instanceof HTMLButtonElement) {
                const buttonStart = button;
                buttonStart.disabled = false;
            }
        });
        const buttonsStop = document.querySelectorAll('.car__button-stop');
        buttonsStop.forEach((button) => {
            if (button instanceof HTMLButtonElement) {
                const buttonStop = button;
                buttonStop.disabled = true;
            }
        });
    }
}
