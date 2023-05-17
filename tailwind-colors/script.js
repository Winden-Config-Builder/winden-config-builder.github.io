window.onload = generatePalette;

function generatePalette() {
    let pickedColor = document.getElementById('colorPicker').value;
    let paletteDiv = document.getElementById('palette');
    
    // clear existing palette
    paletteDiv.innerHTML = '';

    // create shades from white to picked color
    for (let i = 0; i <= 4; i++) {
        let color = color2k.mix('white', pickedColor, i * 0.2);
        createColorDiv(color);
    }

    // create shades from picked color to black
    for (let i = 1; i <= 4; i++) {
        let color = color2k.mix(pickedColor, 'black', i * 0.2);
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
