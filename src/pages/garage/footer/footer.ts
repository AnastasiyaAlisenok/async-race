import { ElementsArgs } from '../../../types/types';
import ElementCreator from '../../../utils/elementCreator';
import View from '../../../utils/view';
import './footer.scss';

const footerArgs: ElementsArgs = {
    tag: 'footer',
    classes: ['footer'],
    textContent: '',
};

const gitArgs: ElementsArgs = {
    tag: 'a',
    classes: ['git'],
    textContent: '',
};

const gitImgArgs: ElementsArgs = {
    tag: 'div',
    classes: ['git__img'],
    textContent: '',
};

const yeafArgs: ElementsArgs = {
    tag: 'span',
    classes: ['year'],
    textContent: '2023',
};

const rssArgs: ElementsArgs = {
    tag: 'a',
    classes: ['rss'],
    textContent: '',
};

const rssImgArgs: ElementsArgs = {
    tag: 'div',
    classes: ['rss__img'],
    textContent: '',
};

const gitHref = 'https://github.com/AnastasiyaAlisenok';
const rssHref = 'https://rs.school/js-stage0/';

export default class Footer extends View {
    constructor() {
        super(footerArgs);
        this.addTags();
    }

    private addTags(): void {
        const git = new ElementCreator(gitArgs);
        (git.getElement() as HTMLLinkElement).href = gitHref;
        const gitImg = new ElementCreator(gitImgArgs);
        git.addInnerHtml(gitImg.getElement() as HTMLElement);
        const year = new ElementCreator(yeafArgs);
        const rss = new ElementCreator(rssArgs);
        (rss.getElement() as HTMLLinkElement).href = rssHref;
        const rssImg = new ElementCreator(rssImgArgs);
        rss.addInnerHtml(rssImg.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(git.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(year.getElement() as HTMLElement);
        this.viewElementCreator.addInnerHtml(rss.getElement() as HTMLElement);
    }
}

