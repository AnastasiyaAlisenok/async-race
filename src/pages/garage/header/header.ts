import './header.scss';
import View from '../../../utils/view';
import { ElementsArgs } from '../../../types/types';
import ElementCreator from '../../../utils/elementCreator';
import GaragePage from '../garage';
import { WinnersPage } from '../../winners/winnersPage';

const headerArgs: ElementsArgs = {
    tag: 'header',
    classes: ['header'],
    textContent: '',
};

const buttonGarageArgs: ElementsArgs = {
    tag: 'button',
    classes: ['header__button-garage'],
    textContent: 'To garage',
};

const buttonWinnersArgs: ElementsArgs = {
    tag: 'button',
    classes: ['header__button-winners'],
    textContent: 'To winners',
};

export default class HeaderGarage extends View {
    constructor() {
        super(headerArgs);
        this.createElements();
    }

    private createElements(): void {
        const buttonGarage = new ElementCreator(buttonGarageArgs);
        const buttonWinners = new ElementCreator(buttonWinnersArgs);
        buttonGarage.getElement()?.addEventListener('click', this.goToGaragePage);
        buttonWinners.getElement()?.addEventListener('click', this.goToWinnersPage);
        this.viewElementCreator.addInnerHtml(buttonGarage.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(buttonWinners.getElement() as HTMLElement);
    }

    public goToGaragePage(): void {
        GaragePage.garage?.classList.add('visible');
        WinnersPage.winners?.classList.remove('visible');
    }

    public goToWinnersPage(): void {
        GaragePage.renderWinnerPage();
        WinnersPage.renderBodyTable();
        GaragePage.garage?.classList.remove('visible');
        WinnersPage.winners?.classList.add('visible');
    }
}

