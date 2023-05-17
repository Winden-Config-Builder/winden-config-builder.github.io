// DOM elements
const colorPicker = document.getElementById('colorPicker');
const colorPickerValue = document.getElementById('colorPickerValue');
const lightnessMinInput = document.getElementById('lightnessMin');
const lightnessMaxInput = document.getElementById('lightnessMax');
const addButton = document.getElementById('addButton');
const removeButton = document.getElementById('removeButton');
const paletteDiv = document.getElementById('palette');

// Configuration
let numBlocks = 6;

// Event listeners
window.onload = generatePalette;
colorPicker.addEventListener('change', handleColorPickerChange);
colorPickerValue.addEventListener('change', handleColorPickerValueChange);
lightnessMinInput.addEventListener('change', generatePalette);
lightnessMaxInput.addEventListener('change', generatePalette);
addButton.addEventListener('click', handleAddButtonClick);
removeButton.addEventListener('click', handleRemoveButtonClick);

// Generate palette on color picker change
function handleColorPickerChange() {
    colorPickerValue.value = colorPicker.value;
    generatePalette();
}

// Update color picker value on input change
function handleColorPickerValueChange() {
    colorPicker.value = colorPickerValue.value;
    generatePalette();
}

// Add button click handler
function handleAddButtonClick() {
    if (numBlocks < 10) {
        numBlocks++;
        generatePalette();
    }
}

// Remove button click handler
function handleRemoveButtonClick() {
    if (numBlocks > 1) {
        numBlocks--;
        generatePalette();
    }
}

// Generate the color palette
function generatePalette() {
    const pickedColor = colorPicker.value;

    // Clear existing palette
    paletteDiv.innerHTML = '';

    const lightnessMin = lightnessMinInput.value / 100;
    const lightnessMax = lightnessMaxInput.value / 100;

    for (let i = 0; i <= 2*numBlocks; i++) {
        let color;
        const ratio = i / (2*numBlocks); // ratio ranges from 0 to 1

        // First half of the colors (from white to the chosen color)
        if (ratio < 0.5) {
            const lightness = lightnessMin + (1 - lightnessMin) * (ratio * 2);
            color = color2k.mix('white', pickedColor, lightness);
        } 
        // At the midpoint, use the chosen color
        else if (ratio === 0.5) {
            color = pickedColor;
            createColorDiv(color, true); // pass true to mark this as the current color
            continue;
        }
        // Second half of the colors (from the chosen color to black)
        else {
            const lightness = lightnessMax * ((ratio - 0.5) * 2);
            color = color2k.mix(pickedColor, 'black', lightness);
        }

        createColorDiv(color);
    }
}





// Convert RGBA to HEX color
function rgbaToHex(rgba) {
    const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}


// Create a color div
function createColorDiv(color, isCurrentColor = false) {
    // Don't create the color div if the color is white or black
    if (color === 'rgb(0, 0, 0)' || color === 'rgb(255, 255, 255)') {
        return;
    }

    const colorWrap = document.createElement('div');
    colorWrap.className = 'colorWrap';
    if (isCurrentColor) {
        colorWrap.classList.add('current-color');
    }

    const colorDiv = document.createElement('div');
    colorDiv.className = 'colorDiv';
    colorDiv.style.backgroundColor = color;

    const colorValue = document.createElement('div');
    colorValue.className = 'colorValue';

    // If the color is in RGB or RGBA format, convert it to HEX
    if (color.startsWith('rgb')) {
        color = rgbaToHex(color);
    }

    colorValue.textContent = color;

    colorWrap.appendChild(colorDiv);
    colorWrap.appendChild(colorValue);
    paletteDiv.appendChild(colorWrap);
}
