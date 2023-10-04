import { ElementsArgs } from '../types/types';

export default class ElementCreator {
    public element: HTMLElement | null;

    constructor(args: ElementsArgs) {
        this.element = null;
        this.createElement(args);
    }

    public getElement(): HTMLElement | null {
        return this.element;
    }

    public addInnerHtml(element: HTMLElement | ElementCreator): void {
        if (element instanceof ElementCreator) {
            this.element?.append(element.getElement() as HTMLElement);
        } else {
            this.element?.append(element);
        }
    }

    public createElement(args: ElementsArgs): void {
        this.element = document.createElement(args.tag);
        this.setCssClass(args.classes);
        this.addTextContent(args.textContent);
        if (args.callback !== undefined) {
            this.setCallback(args.callback);
        }
    }

    public setCssClass(cssClasses: string[] | (string | string[])[] | undefined): void {
        if (cssClasses) {
            cssClasses.forEach((cssClass: string | string[]) => {
                if (typeof cssClass === 'string') {
                    this.element?.classList.add(cssClass);
                } else if (typeof cssClass === 'object') {
                    for (let j = 0; j < cssClass.length; j += 1) {
                        this.element?.classList.add(cssClass[j]);
                    }
                }
            });
        }
    }

    private addTextContent(text: string): void {
        if (this.element !== undefined && this.element !== null) {
            this.element.textContent = text;
        }
    }

    public setCallback(callback: () => void): void {
        if (typeof callback === 'function') {
            this.element?.addEventListener('click', callback);
        }
    }
}
