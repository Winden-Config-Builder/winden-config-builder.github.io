window.onload = generatePalette;

let numBlocks = 6;

document.getElementById('addButton').onclick = function() {
    if (numBlocks < 10) {
        numBlocks++;
        generatePalette();
    }
};

document.getElementById('removeButton').onclick = function() {
    if (numBlocks > 1) {
        numBlocks--;
        generatePalette();
    }
};

document.getElementById('colorPicker').onchange = function() {
    document.getElementById('colorPickerValue').value = this.value;
    generatePalette();
};

document.getElementById('colorPickerValue').onchange = function() {
    document.getElementById('colorPicker').value = this.value;
    generatePalette();
};

function generatePalette() {
    let pickedColor = document.getElementById('colorPicker').value;
    let paletteDiv = document.getElementById('palette');

    // clear existing palette
    paletteDiv.innerHTML = '';

    // create shades from white to picked color
    for (let i = 1; i < numBlocks - 1; i++) {
        let ratio = i / (numBlocks - 1);
        let color = color2k.mix('white', pickedColor, ratio);
        createColorDiv(color);
    }

    // create the picked color block
    createColorDiv(pickedColor);

    // create shades from picked color to black
    for (let i = 1; i < numBlocks - 1; i++) {
        let ratio = i / (numBlocks - 1);
        let color = color2k.mix(pickedColor, 'black', ratio);
        createColorDiv(color);
    }
}

function rgbaToHex(rgba) {
    let match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}

function createColorDiv(color) {
    // Don't create the color div if the color is white or black
    if (color === 'rgb(0, 0, 0)' || color === 'rgb(255, 255, 255)') {
        return;
    }

    let colorWrap = document.createElement('div');
    colorWrap.className = 'colorWrap';

    let colorDiv = document.createElement('div');
    colorDiv.className = 'colorDiv';
    colorDiv.style.backgroundColor = color;

    let colorValue = document.createElement('div');
    colorValue.className = 'colorValue';

    // If the color is in RGB or RGBA format, convert it to HEX
    if (color.startsWith('rgb')) {
        color = rgbaToHex(color);
    }

    colorValue.textContent = color;

    colorWrap.appendChild(colorDiv);
    colorWrap.appendChild(colorValue);
    document.getElementById('palette').appendChild(colorWrap);
}