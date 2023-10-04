export default function checkElement(element: HTMLElement | null): Element {
    if (element) {
        return element;
    }
    throw new Error();
}
