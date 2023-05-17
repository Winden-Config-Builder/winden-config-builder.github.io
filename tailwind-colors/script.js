// DOM elements
const colorPicker = document.getElementById('colorPicker');
const colorPickerValue = document.getElementById('colorPickerValue');
const lightnessMinInput = document.getElementById('lightnessMin');
const lightnessMaxInput = document.getElementById('lightnessMax');
const addButton = document.getElementById('addButton');
const removeButton = document.getElementById('removeButton');
const paletteDiv = document.getElementById('palette');


// Add an event listener for the new button
const addColorPickerButton = document.getElementById('addColorPickerButton');
addColorPickerButton.addEventListener('click', handleAddColorPickerButtonClick);


// Configuration
let numBlocks = 6;

// Event listeners
window.onload = generatePalette;
document.getElementById('addColorPickerButton').addEventListener('click', handleAddColorPickerButtonClick);
document.getElementById('lightnessMin').addEventListener('change', generatePalette);
document.getElementById('lightnessMax').addEventListener('change', generatePalette);
document.getElementById('addButton').addEventListener('click', handleAddButtonClick);
document.getElementById('removeButton').addEventListener('click', handleRemoveButtonClick);

// Generate palette on color picker change
function handleColorPickerChange(event) {
    const picker = event.target;
    const pickerValue = picker.nextSibling;
    pickerValue.value = picker.value;
    generatePalette();
}

// Update color picker value on input change
function handleColorPickerValueChange(event) {
    const pickerValue = event.target;
    const picker = pickerValue.previousSibling;
    picker.value = pickerValue.value;
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

// Handle the creation of new color pickers
function handleAddColorPickerButtonClick() {
    const colorPickerContainer = document.getElementById('colorPickerContainer');

    const colorPickerWrap = document.createElement('div');
    colorPickerWrap.className = 'colorPickerWrap';

    const label = document.createElement('label');
    label.textContent = 'Color';

    const flex = document.createElement('div');
    flex.className = 'flex';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'colorPicker';
    colorPicker.value = '#ff0000';
    colorPicker.addEventListener('change', handleColorPickerChange);

    const colorPickerValue = document.createElement('input');
    colorPickerValue.type = 'text';
    colorPickerValue.className = 'colorPickerValue';
    colorPickerValue.value = '#ff0000';
    colorPickerValue.addEventListener('change', handleColorPickerValueChange);

    flex.appendChild(colorPicker);
    flex.appendChild(colorPickerValue);
    colorPickerWrap.appendChild(label);
    colorPickerWrap.appendChild(flex);
    colorPickerContainer.appendChild(colorPickerWrap);

    generatePalette();
}


// Generate the color palette
function generatePalette() {
    const colorPickers = Array.from(document.getElementsByClassName('colorPicker'));
    const pickedColors = colorPickers.map(picker => picker.value);
    const numColors = pickedColors.length;

    // Clear existing palette
    paletteDiv.innerHTML = '';

    if(numColors === 1) {
        const lightnessMin = lightnessMinInput.value / 100;
        const lightnessMax = lightnessMaxInput.value / 100;

        for (let i = 0; i <= 2*numBlocks; i++) {
            let color;
            const ratio = i / (2*numBlocks); // ratio ranges from 0 to 1

            // First half of the colors (from white to the chosen color)
            if (ratio < 0.5) {
                const lightness = lightnessMin + (1 - lightnessMin) * (ratio * 2);
                color = color2k.mix('white', pickedColors[0], lightness);
            } 
            // At the midpoint, use the chosen color
            else if (ratio === 0.5) {
                color = pickedColors[0];
                createColorDiv(color, true); // pass true to mark this as the current color
                continue;
            }
            // Second half of the colors (from the chosen color to black)
            else {
                const lightness = lightnessMax * ((ratio - 0.5) * 2);
                color = color2k.mix(pickedColors[0], 'black', lightness);
            }

            createColorDiv(color);
        }
    } else {
        for (let i = 0; i < numBlocks; i++) {
            const colorIndex = Math.floor(i / (numBlocks / (numColors - 1)));
            const color1 = pickedColors[colorIndex % numColors];
            const color2 = pickedColors[Math.min(colorIndex + 1, numColors - 1)];

            const ratio = (i % (numBlocks / (numColors - 1))) / (numBlocks / (numColors - 1));

            const color = color2k.mix(color1, color2, ratio);

            createColorDiv(color);
        }
        // Add the last color
        createColorDiv(pickedColors[numColors - 1]);
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
