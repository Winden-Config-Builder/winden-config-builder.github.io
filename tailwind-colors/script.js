window.onload = generatePalette;

let numBlocks = 5;

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
    for (let i = 0; i < numBlocks - 1; i++) {
        let ratio = i / (numBlocks - 1);
        let color = color2k.mix('white', pickedColor, ratio);
        createColorDiv(color);
    }

    // create the picked color block
    // createColorDiv(pickedColor);

    // create shades from picked color to black
    for (let i = 1; i < numBlocks; i++) {
        let ratio = i / (numBlocks - 1);
        let color = color2k.mix(pickedColor, 'black', ratio);
        createColorDiv(color);
    }
}

function createColorDiv(color) {
    let colorWrap = document.createElement('div');
    colorWrap.className = 'colorWrap';

    let colorDiv = document.createElement('div');
    colorDiv.className = 'colorDiv';
    colorDiv.style.backgroundColor = color;

    let colorValue = document.createElement('div');
    colorValue.className = 'colorValue';
    colorValue.textContent = color;

    colorWrap.appendChild(colorDiv);
    colorWrap.appendChild(colorValue);
    document.getElementById('palette').appendChild(colorWrap);
}
