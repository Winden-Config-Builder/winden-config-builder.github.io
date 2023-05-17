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

    // Get lightness min and max values from the inputs
    let lightnessMin = document.getElementById('lightnessMin').value / 100;
    let lightnessMax = document.getElementById('lightnessMax').value / 100;

    // create shades from lightnessMin to picked color
    for (let i = 0; i < numBlocks; i++) {
        let ratio = lightnessMin + (i / (numBlocks - 1)) * (1 - lightnessMin);
        let color = color2k.mix('white', pickedColor, ratio);
        createColorDiv(color);
    }

    // create shades from picked color to lightnessMax
    for (let i = 0; i < numBlocks; i++) {
        let ratio = lightnessMax * (i / (numBlocks - 1));
        let color = color2k.mix(pickedColor, 'black', ratio);
        createColorDiv(color);
    }
}

document.getElementById('lightnessMin').onchange = generatePalette;
document.getElementById('lightnessMax').onchange = generatePalette;


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