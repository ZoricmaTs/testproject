const factory = document.createElement('div');



export function DOM(string: string): Element {
    factory.innerHTML = string;
    return factory.firstElementChild;
};