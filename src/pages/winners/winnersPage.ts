import ElementCreator from '../../utils/elementCreator';
import { ElementsArgs, Winner, WinnersResponse } from '../../types/types';
import './winnersPage.scss';
import { getCar, getWinners } from '../api/api-requests';
import carImage from '../../assets/img/car-img-code';
import checkElement from '../../utils/checkElement';

export const enum SortBy {
    id = 'id',
    wins = 'wins',
    time = 'time',
}

export const enum Order {
    asc = 'ASC',
    desc = 'DESC',
}

const winnersContainerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['page__winners'],
    textContent: '',
};

const titleArgs: ElementsArgs = {
    tag: 'h1',
    classes: ['winners__title'],
    textContent: '',
};

const pageNumberArgs: ElementsArgs = {
    tag: 'h2',
    classes: ['winners__page-number'],
    textContent: '',
};

const tableContainerArgs: ElementsArgs = {
    tag: 'table',
    classes: ['table'],
    textContent: '',
};

const tableHeadArgs: ElementsArgs = {
    tag: 'thead',
    classes: ['table__head'],
    textContent: '',
};

const headRowArgs: ElementsArgs = {
    tag: 'tr',
    classes: ['table__head-row'],
    textContent: '',
};

const headCeilArgs: ElementsArgs = {
    tag: 'th',
    classes: ['head-ceil'],
    textContent: '',
};

const tableBodyArgs: ElementsArgs = {
    tag: 'tbody',
    classes: ['table__body'],
    textContent: '',
};

const bodyRowArgs: ElementsArgs = {
    tag: 'tr',
    classes: ['table__body-row'],
    textContent: '',
};

const bodyCeilArgs: ElementsArgs = {
    tag: 'td',
    classes: ['body-ceil'],
    textContent: '',
};

const buttonsArgs: ElementsArgs = {
    tag: 'div',
    classes: ['winners__buttons'],
    textContent: '',
};

const buttonPrevArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__prev'],
    textContent: 'Prev',
};

const buttonNextArgs: ElementsArgs = {
    tag: 'button',
    classes: ['button', 'button__next'],
    textContent: 'Next',
};

const arrowArgs: ElementsArgs = {
    tag: 'span',
    classes: ['button__arrow'],
    textContent: '',
};

export class WinnersPage {
    public static COUNT_WINNERS: string | null = '0';

    public static PAGE_NUMBER = 1;

    public static FIRST_PAGE = 1;

    public static COUNT_WINNERS_ON_PAGE = 10;

    public static winners: HTMLElement | null;

    public static bodyTable: HTMLElement = WinnersPage.createBodyTable();

    public static winnersTitle: HTMLElement;

    public static pageTitle: HTMLElement;

    public static table: HTMLElement;

    public static sortOrderByTime = false;

    public static sortOrderByWins = false;

    public static order = Order.asc;

    public static sort = SortBy.id;

    public createView(): void {
        const winnersPage = new ElementCreator(winnersContainerArgs);
        WinnersPage.winners = winnersPage.getElement();
        const titleWinners = new ElementCreator(titleArgs).getElement() as HTMLElement;
        getWinners(WinnersPage.PAGE_NUMBER, WinnersPage.COUNT_WINNERS_ON_PAGE, SortBy.id, Order.asc).then((obj) => {
            WinnersPage.COUNT_WINNERS = obj.count;
            titleWinners.textContent = `Winners (${WinnersPage.COUNT_WINNERS})`;
        });
        WinnersPage.winnersTitle = titleWinners;
        const pageNumber = new ElementCreator(pageNumberArgs).getElement() as HTMLElement;
        WinnersPage.pageTitle = pageNumber;
        pageNumber.textContent = `Page #${WinnersPage.PAGE_NUMBER}`;
        const table = this.createTable();
        const buttonsContainer = new ElementCreator(buttonsArgs);
        const buttonPrev = new ElementCreator(buttonPrevArgs).getElement() as HTMLButtonElement;
        const buttonNext = new ElementCreator(buttonNextArgs).getElement() as HTMLButtonElement;
        buttonPrev.addEventListener('click', this.clickPrev);
        buttonNext.addEventListener('click', this.clickNext);
        buttonsContainer.addInnerHtml(buttonPrev);
        buttonsContainer.addInnerHtml(buttonNext);
        winnersPage.addInnerHtml(titleWinners);
        winnersPage.addInnerHtml(pageNumber);
        winnersPage.addInnerHtml(table);
        winnersPage.addInnerHtml(buttonsContainer);
        document.body.append(winnersPage.getElement() as HTMLElement);
        WinnersPage.disableButtons();
    }

    private createTable(): HTMLElement {
        const tableContainer = new ElementCreator(tableContainerArgs);
        const head = new ElementCreator(tableHeadArgs);
        const headRow = new ElementCreator(headRowArgs);
        const number = new ElementCreator(headCeilArgs).getElement() as HTMLElement;
        number.textContent = 'Number';
        const car = new ElementCreator(headCeilArgs).getElement() as HTMLElement;
        car.textContent = 'Car';
        const nameCar = new ElementCreator(headCeilArgs).getElement() as HTMLElement;
        nameCar.textContent = 'Name';
        const countWins = new ElementCreator(headCeilArgs).getElement() as HTMLElement;
        countWins.textContent = 'Wins';
        countWins.id = 'wins';
        const arrowWins = new ElementCreator(arrowArgs).getElement() as HTMLElement;
        countWins.append(arrowWins);
        countWins.addEventListener('click', this.sortTable);
        const bestTime = new ElementCreator(headCeilArgs).getElement() as HTMLElement;
        bestTime.textContent = 'Best time (seconds)';
        bestTime.id = 'time';
        const arrowTime = new ElementCreator(arrowArgs).getElement() as HTMLElement;
        bestTime.append(arrowTime);
        bestTime.addEventListener('click', this.sortTable);
        headRow.addInnerHtml(number);
        headRow.addInnerHtml(car);
        headRow.addInnerHtml(nameCar);
        headRow.addInnerHtml(countWins);
        headRow.addInnerHtml(bestTime);
        head.addInnerHtml(headRow.getElement() as HTMLElement);
        tableContainer.addInnerHtml(head.getElement() as HTMLElement);
        WinnersPage.table = tableContainer.getElement() as HTMLElement;
        tableContainer.addInnerHtml(WinnersPage.bodyTable);
        return tableContainer.getElement() as HTMLElement;
    }

    public static createBodyTable(): HTMLElement {
        const tableBody = new ElementCreator(tableBodyArgs);
        getWinners(
            WinnersPage.PAGE_NUMBER,
            WinnersPage.COUNT_WINNERS_ON_PAGE,
            WinnersPage.sort,
            WinnersPage.order
        ).then((obj) => {
            WinnersPage.addRows(obj, tableBody);
            WinnersPage.COUNT_WINNERS = obj.count;
            WinnersPage.winnersTitle.textContent = `Winners (${WinnersPage.COUNT_WINNERS})`;
        });
        WinnersPage.bodyTable = tableBody.getElement() as HTMLElement;
        return tableBody.getElement() as HTMLElement;
    }

    private clickPrev(): void {
        WinnersPage.PAGE_NUMBER -= 1;
        WinnersPage.pageTitle.textContent = `Page #${WinnersPage.PAGE_NUMBER}`;
        WinnersPage.renderBodyTable();
        WinnersPage.disableButtons();
        const buttonNext = document.querySelector('.page__winners .button__next') as HTMLButtonElement;
        buttonNext.disabled = false;
    }

    private clickNext(): void {
        WinnersPage.PAGE_NUMBER += 1;
        WinnersPage.pageTitle.textContent = `Page #${WinnersPage.PAGE_NUMBER}`;
        WinnersPage.renderBodyTable();
        WinnersPage.disableButtons();
        const buttonPrev = document.querySelector('.page__winners .button__prev') as HTMLButtonElement;
        buttonPrev.disabled = false;
    }

    public static renderBodyTable(): void {
        WinnersPage.bodyTable.remove();
        const newBodyTable = WinnersPage.createBodyTable();
        WinnersPage.table.append(newBodyTable);
    }

    private static disableButtons(): void {
        if (WinnersPage.PAGE_NUMBER === WinnersPage.FIRST_PAGE) {
            const buttonPrev = document.querySelector('.page__winners .button__prev') as HTMLButtonElement;
            buttonPrev.disabled = true;
        }
        const lastPage = Math.ceil(Number(WinnersPage.COUNT_WINNERS) / WinnersPage.COUNT_WINNERS_ON_PAGE);
        if (WinnersPage.PAGE_NUMBER === lastPage) {
            const buttonNext = document.querySelector('.page__winners .button__next') as HTMLButtonElement;
            buttonNext.disabled = true;
        }
    }

    private sortTable(event: Event): void {
        const button = event.target as HTMLElement;
        WinnersPage.setInfoAboutSort(button);
        WinnersPage.bodyTable.remove();
        const tableBody = new ElementCreator(tableBodyArgs);
        getWinners(
            WinnersPage.PAGE_NUMBER,
            WinnersPage.COUNT_WINNERS_ON_PAGE,
            WinnersPage.sort,
            WinnersPage.order
        ).then((obj) => {
            WinnersPage.addRows(obj, tableBody);
        });
        WinnersPage.bodyTable = tableBody.getElement() as HTMLElement;
        WinnersPage.table.append(WinnersPage.bodyTable);
    }

    private static addRows(obj: WinnersResponse, tableBody: ElementCreator): void {
        Array.from(obj.winners).forEach((winner, index) => {
            const row = new ElementCreator(bodyRowArgs);
            const number = new ElementCreator(bodyCeilArgs).getElement() as HTMLElement;
            number.textContent = `${index + (WinnersPage.PAGE_NUMBER - 1) * WinnersPage.COUNT_WINNERS_ON_PAGE + 1}`;
            const carInfo = new ElementCreator(bodyCeilArgs).getElement() as HTMLElement;
            const model = new ElementCreator(bodyCeilArgs).getElement() as HTMLElement;
            const wins = new ElementCreator(bodyCeilArgs).getElement() as HTMLElement;
            wins.textContent = `${winner.wins}`;
            const time = new ElementCreator(bodyCeilArgs).getElement() as HTMLElement;
            time.textContent = `${winner.time}`;
            carInfo.innerHTML = carImage;
            getCar(String(winner.id)).then((car) => {
                const svg = carInfo.firstChild as HTMLElement;
                svg?.setAttribute('fill', car.color);
                model.textContent = car.name;
            });
            row.addInnerHtml(number);
            row.addInnerHtml(carInfo);
            row.addInnerHtml(model);
            row.addInnerHtml(wins);
            row.addInnerHtml(time);
            tableBody.addInnerHtml(row.getElement() as HTMLElement);
        });
    }

    private static setInfoAboutSort(button: HTMLElement): void {
        const arrow = button.firstElementChild;
        if (button.id === 'time') {
            WinnersPage.sort = SortBy.time;
            if (WinnersPage.sortOrderByTime === true) {
                WinnersPage.order = Order.desc;
                WinnersPage.sortOrderByTime = false;
                if (arrow) {
                    arrow.innerHTML = '&uarr;';
                }
            } else {
                WinnersPage.order = Order.asc;
                WinnersPage.sortOrderByTime = true;
                if (arrow) {
                    arrow.innerHTML = '&darr;';
                }
            }
        }
        if (button.id === 'wins') {
            WinnersPage.sort = SortBy.wins;
            if (WinnersPage.sortOrderByWins === true) {
                WinnersPage.order = Order.desc;
                WinnersPage.sortOrderByWins = false;
                if (arrow) {
                    arrow.innerHTML = '&uarr;';
                }
            } else {
                WinnersPage.order = Order.asc;
                WinnersPage.sortOrderByWins = true;
                if (arrow) {
                    arrow.innerHTML = '&darr;';
                }
            }
        }
    }
}

