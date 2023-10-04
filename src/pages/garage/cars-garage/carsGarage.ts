import { CarCreate, Cars, CarsResponse, ElementsArgs } from '../../../types/types';
import ElementCreator from '../../../utils/elementCreator';
import View from '../../../utils/view';
import CreateCar from '../createCar/createCar';
import './carsGarage.scss';
import { getCars, createCar } from '../../api/api-requests';
import PanelControl from '../panel-control/panelControl';
import GaragePage from '../garage';
import checkElement from '../../../utils/checkElement';
import { randomColor, randomName } from '../../../utils/random-functions';

const carsContainerArgs: ElementsArgs = {
    tag: 'section',
    classes: ['cars-container'],
    textContent: '',
};

const titleContainerArgs: ElementsArgs = {
    tag: 'span',
    classes: ['cars-container__title'],
    textContent: 'Garage',
};

const countCarsArgs: ElementsArgs = {
    tag: 'span',
    classes: ['cars-container__count-cars'],
    textContent: '',
};

const pageContainerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['cars-container__page'],
    textContent: '',
};

const wrapperArgs: ElementsArgs = {
    tag: 'div',
    classes: ['cars-container__page-wrapper'],
    textContent: '',
};

const pageTitleArgs: ElementsArgs = {
    tag: 'h2',
    classes: ['cars-container__page-title'],
    textContent: 'Page',
};

const pageCountArgs: ElementsArgs = {
    tag: 'span',
    classes: ['cars-container__page-count'],
    textContent: '',
};

const pageNavArgs: ElementsArgs = {
    tag: 'div',
    classes: ['cars-container__page-nav'],
    textContent: '',
};

const prevButtonArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__prev'],
    textContent: 'Prev',
};

const nextButtonArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__next'],
    textContent: 'Next',
};

export default class CarsGarage extends View {
    public static COUNT_CARS = 0;

    public static PAGE_NUMBER = 1;

    public static FIRST_PAGE = 1;

    public static COUNT_CARS_ON_PAGE = 7;

    public static GENERATE_COUNT = 100;

    constructor() {
        super(carsContainerArgs);
        this.addCars();
    }

    private createElements(): void {
        const title = new ElementCreator(titleContainerArgs);
        const countCarsEl = new ElementCreator(countCarsArgs).getElement() as HTMLElement;
        countCarsEl.textContent = `(${CarsGarage.COUNT_CARS})`;
        const pageContainer = new ElementCreator(pageContainerArgs);
        const wrapper = new ElementCreator(wrapperArgs);
        const pageTitle = new ElementCreator(pageTitleArgs);
        const pageCount = new ElementCreator(pageCountArgs).getElement() as HTMLElement;
        pageCount.textContent = `#${CarsGarage.PAGE_NUMBER}`;
        wrapper.addInnerHtml(pageTitle.getElement() as HTMLElement);
        wrapper.addInnerHtml(pageCount);
        pageContainer.addInnerHtml(wrapper.getElement() as HTMLElement);
        const pageNav = this.addPageNav();
        pageContainer.addInnerHtml(pageNav);
        this.viewElementCreator.addInnerHtml(title.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(countCarsEl);
        this.viewElementCreator.addInnerHtml(pageContainer.getElement() as HTMLElement);
    }

    public addPageNav(): HTMLElement {
        const pageNav = new ElementCreator(pageNavArgs);
        const buttonPrev = new ElementCreator(prevButtonArgs);
        const buttonNext = new ElementCreator(nextButtonArgs);
        if (CarsGarage.PAGE_NUMBER === CarsGarage.FIRST_PAGE) {
            (buttonPrev.getElement() as HTMLButtonElement).disabled = true;
        }
        const lastPage = Math.ceil(CarsGarage.COUNT_CARS / CarsGarage.COUNT_CARS_ON_PAGE);
        if (CarsGarage.PAGE_NUMBER === lastPage) {
            (buttonNext.getElement() as HTMLButtonElement).disabled = true;
        }
        buttonNext.getElement()?.addEventListener('click', GaragePage.clickNext);
        buttonPrev.getElement()?.addEventListener('click', GaragePage.clickPrev);
        pageNav.addInnerHtml(buttonPrev.getElement() as HTMLElement);
        pageNav.addInnerHtml(buttonNext.getElement() as HTMLElement);
        return pageNav.getElement() as HTMLElement;
    }

    public addCars(): void {
        getCars(CarsGarage.PAGE_NUMBER, CarsGarage.COUNT_CARS_ON_PAGE).then((obj: CarsResponse) => {
            CarsGarage.COUNT_CARS = Number(obj.count);
            this.createElements();
            Array.from(obj.cars).forEach((element: Cars) => {
                const car = new CreateCar();
                car.createElements(element.name, element.color, element.id);
                this.viewElementCreator.addInnerHtml(car.getHtmlElement() as HTMLElement);
            });
        });
    }

    public static createNewcar({ name: nameCar, color: colorCar }: CarCreate): void {
        createCar({ name: nameCar, color: colorCar }).then((obj: Cars) => {
            const car = new CreateCar();
            car.createElements(obj.name, obj.color, obj.id);
            CarsGarage.addCarsOnPage(car);
        });
    }

    public static addNewCar(): void {
        CarsGarage.createNewcar({ name: PanelControl.carName, color: PanelControl.color });
        const countCarsEl = checkElement(document.querySelector('.cars-container__count-cars'));
        CarsGarage.COUNT_CARS += 1;
        countCarsEl.textContent = `(${CarsGarage.COUNT_CARS})`;
    }

    public static addCarsOnPage(car: View): void {
        const lastPage = Math.ceil(CarsGarage.COUNT_CARS / CarsGarage.COUNT_CARS_ON_PAGE);
        if (
            (CarsGarage.COUNT_CARS % CarsGarage.COUNT_CARS_ON_PAGE !== 0 ||
                CarsGarage.PAGE_NUMBER === CarsGarage.FIRST_PAGE) &&
            CarsGarage.PAGE_NUMBER === lastPage
        ) {
            const garage = document.querySelector('.cars-container');
            garage?.append(car.getHtmlElement() as HTMLElement);
        }
        const buttonNext = document.querySelector('.button__next') as HTMLButtonElement;
        if (CarsGarage.PAGE_NUMBER !== lastPage && buttonNext.disabled === true) {
            buttonNext.disabled = false;
        }
    }

    public static generateCars(): void {
        for (let i = 0; i < CarsGarage.GENERATE_COUNT; i += 1) {
            const model = randomName();
            const colorCar = randomColor();
            createCar({ name: model, color: colorCar }).then((obj) => {
                const car = new CreateCar();
                car.createElements(obj.name, obj.color, obj.id);
            });
        }
        GaragePage.renderPage();
    }
}

