import { ElementsArgs } from '../../../types/types';
import ElementCreator from '../../../utils/elementCreator';
import View from '../../../utils/view';
import { getCar } from '../../api/api-requests';
import GaragePage from '../garage';
import './modalWindow.scss';

const modalContainerArgs: ElementsArgs = {
    tag: 'div',
    classes: ['modal-window'],
    textContent: '',
};

const modalTextArgs: ElementsArgs = {
    tag: 'div',
    classes: ['modal-window__text'],
    textContent: '',
};

export default class ModalWindow extends View {
    constructor() {
        super(modalContainerArgs);
    }

    public createView(): void {
        const text = new ElementCreator(modalTextArgs).getElement() as HTMLElement;
        getCar(String(GaragePage.winnerId)).then((obj) => {
            text.textContent = `${obj.name} went first with ${GaragePage.winnerTime} seconds!`;
        });
        this.viewElementCreator.addInnerHtml(text);
    }
}

