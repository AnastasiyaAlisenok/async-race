import { ElementsArgs } from '../../../types/types';
import ElementCreator from '../../../utils/elementCreator';
import View from '../../../utils/view';
import CarsGarage from '../cars-garage/carsGarage';
import CreateCar from '../createCar/createCar';
import GaragePage from '../garage';
import './panelControl.scss';

const controlArgs: ElementsArgs = {
    tag: 'section',
    classes: ['panel-control'],
    textContent: '',
};

const containerCreateCarsArgs: ElementsArgs = {
    tag: 'div',
    classes: ['panel', 'create-cars'],
    textContent: '',
};

const nameCreateCarsArgs: ElementsArgs = {
    tag: 'input',
    classes: ['create-cars__name'],
    textContent: '',
};

const colorCreateCarsArgs: ElementsArgs = {
    tag: 'input',
    classes: ['create-cars__color'],
    textContent: '',
};

const buttonCreateCarsArgs: ElementsArgs = {
    tag: 'button',
    classes: ['create-cars__button', 'button'],
    textContent: 'Create',
};

const containerUpdateCarsArgs: ElementsArgs = {
    tag: 'div',
    classes: ['panel', 'update-cars'],
    textContent: '',
};

const nameUpdateCarsArgs: ElementsArgs = {
    tag: 'input',
    classes: ['update-cars__name'],
    textContent: '',
};

const colorUpdateCarsArgs: ElementsArgs = {
    tag: 'input',
    classes: ['update-cars__color'],
    textContent: '',
};

const buttonUpdateCarsArgs: ElementsArgs = {
    tag: 'button',
    classes: ['update-cars__button', 'button'],
    textContent: 'Update',
};

const buttonsContainerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['buttons'],
    textContent: '',
};

const buttonRaceArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__race'],
    textContent: 'Race',
};

const buttonResetArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__reset'],
    textContent: 'Reset',
};

const buttonGenerateCarsArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__generate-cars'],
    textContent: 'Generate cars',
};

export default class PanelControl extends View {
    public static carName: string;

    public static color: string;

    public static carNameUpdate: string;

    public static colorUpdate: string;

    constructor() {
        super(controlArgs);
        this.addCreateCars();
        this.addUpdateCars();
        this.addButtons();
    }

    private addCreateCars(): void {
        const containerCreateCar = new ElementCreator(containerCreateCarsArgs);
        const nameCarCreate = new ElementCreator(nameCreateCarsArgs).getElement() as HTMLInputElement;
        nameCarCreate.addEventListener('change', () => {
            PanelControl.carName = nameCarCreate.value;
        });
        const colorCarCreate = new ElementCreator(colorCreateCarsArgs).getElement() as HTMLInputElement;
        colorCarCreate.type = 'color';
        colorCarCreate.addEventListener('change', () => {
            PanelControl.color = colorCarCreate.value;
        });
        const buttonCreateCars = new ElementCreator(buttonCreateCarsArgs);
        buttonCreateCars.getElement()?.addEventListener('click', CarsGarage.addNewCar);
        containerCreateCar.addInnerHtml(nameCarCreate);
        containerCreateCar.addInnerHtml(colorCarCreate as HTMLElement);
        containerCreateCar.addInnerHtml(buttonCreateCars.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(containerCreateCar);
    }

    private addUpdateCars(): void {
        const containerUpdateCar = new ElementCreator(containerUpdateCarsArgs);
        const nameCarUpdate = new ElementCreator(nameUpdateCarsArgs).getElement() as HTMLInputElement;
        nameCarUpdate.addEventListener('change', () => {
            PanelControl.carNameUpdate = nameCarUpdate.value;
        });
        const colorCarUpdate = new ElementCreator(colorUpdateCarsArgs).getElement() as HTMLInputElement;
        colorCarUpdate.type = 'color';
        colorCarUpdate.addEventListener('change', () => {
            PanelControl.colorUpdate = colorCarUpdate.value;
        });
        const buttonUpdateCars = new ElementCreator(buttonUpdateCarsArgs);
        buttonUpdateCars.getElement()?.addEventListener('click', CreateCar.updateCarInfo);
        containerUpdateCar.addInnerHtml(nameCarUpdate);
        containerUpdateCar.addInnerHtml(colorCarUpdate as HTMLElement);
        containerUpdateCar.addInnerHtml(buttonUpdateCars.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(containerUpdateCar);
    }

    private addButtons(): void {
        const buttonsContainer = new ElementCreator(buttonsContainerArgs);
        const buttonRace = new ElementCreator(buttonRaceArgs).getElement() as HTMLButtonElement;
        const buttonReset = new ElementCreator(buttonResetArgs).getElement() as HTMLButtonElement;
        const buttonGenerateCars = new ElementCreator(buttonGenerateCarsArgs).getElement() as HTMLButtonElement;
        buttonRace.addEventListener('click', () => {
            buttonRace.disabled = true;
            buttonReset.disabled = true;
            buttonGenerateCars.disabled = true;
            GaragePage.clickRace();
        });
        buttonReset.addEventListener('click', () => {
            GaragePage.clickReset();
            buttonRace.disabled = false;
            buttonGenerateCars.disabled = false;
            GaragePage.disableButtons();
        });
        buttonGenerateCars.addEventListener('click', CarsGarage.generateCars);
        buttonsContainer.addInnerHtml(buttonRace);
        buttonsContainer.addInnerHtml(buttonReset);
        buttonsContainer.addInnerHtml(buttonGenerateCars);
        this.viewElementCreator.addInnerHtml(buttonsContainer.getElement() as HTMLElement);
    }
}

