function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16)
    ].join(", ");
}

function setElementStyles(elements, cssProperty, value) {
    elements.forEach(element => {
        element.style[cssProperty] = value;
    });
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);

    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });

    parent.appendChild(element);

    return element
}