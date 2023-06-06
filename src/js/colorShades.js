// DOM elements
const lightnessMinInput = document.querySelector(".lightnessMin");
const lightnessMaxInput = document.querySelector(".lightnessMax");
const numBlocksInput = document.querySelector(".numBlocks");
const shadesCheckbox = document.querySelector(".shadesCheckbox");
// Configuration
let numBlocks = Number(numBlocksInput.value);

// Event listeners
window.addEventListener("load", generatePalette);
document.querySelector(".addColorPickerButton").addEventListener("click", addColorPicker);
document.querySelector(".clone-color-row").addEventListener("click", DuplicateColorRow);
document.querySelector(".delete-row-color").addEventListener("click", DeleteColorRow);
shadesCheckbox.addEventListener("click", ToggleColorShades);
lightnessMinInput.addEventListener("change", generatePalette);
lightnessMaxInput.addEventListener("change", generatePalette);
numBlocksInput.addEventListener("change", handleNumBlocksInputChange);
const colorPickers = document.getElementsByClassName("colorPicker");

if (shadesCheckbox.checked == false) {
    document.querySelector(".palette").style.display = "none";
    document.querySelector(".addColorPickerButton").style.display = "none";
    document.querySelector(".advanced-s").style.display = "none";
}

for (const picker of colorPickers) {
  picker.addEventListener("change", handleColorPickerChange);
  const pickerValue = picker.nextElementSibling;
  pickerValue.addEventListener("change", handleColorPickerValueChange);
}

// Handles color picker change
function handleColorPickerChange(event) {
  const picker = event.target;
  const pickerValue = picker.nextElementSibling;
  pickerValue.value = picker.value;
  generatePalette();
}

// Handles color picker value change
function handleColorPickerValueChange(event) {
  const pickerValue = event.target;
  const picker = pickerValue.previousElementSibling;
  picker.value = pickerValue.value;
  generatePalette();
}

// Handles the creation of new color pickers
function addColorPicker(event) {
    const ColorRow = event.currentTarget.closest(".color-row");
    const colorPickerContainer = ColorRow.querySelector(".colorPickerContainer");
    const colorPickerWrap = document.createElement("div");
    colorPickerWrap.className = "colorPickerWrap flex items-end";

    const flex = document.createElement("div");
    flex.className = "grid";

    const colorPicker = createInputElement("color", "colorPicker w-[80px] h-[40px] mb-1", "#ff0000", handleColorPickerChange);
    const colorPickerValue = createInputElement("text", "colorPickerValue", "#ff0000", handleColorPickerValueChange);
    colorPickerValue.className = "input w-[80px]";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.className = "border border-slate-200 text-blue-500 ml-2 p-2 rounded-md"
    deleteButton.addEventListener("click", handleDeleteButtonClick);

    appendChildren(flex, [colorPicker, colorPickerValue]);
    appendChildren(colorPickerWrap, [flex, deleteButton]);

    colorPickerContainer.appendChild(colorPickerWrap);
    generatePalette();
}

// Helper function to create an input element
function createInputElement(type, className, value, handler) {
    const inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.className = className;
    inputElement.value = value;
    inputElement.addEventListener("change", handler);
    return inputElement;
}

// Helper function to append multiple children to a parent
function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

// Handles the removal of color pickers
function handleDeleteButtonClick(event) {
    if (event.target) {
        var colorPickerWrap = event.target.parentNode;
    } else {
        var colorPickerWrap = event.parentNode;
    }
    colorPickerWrap.remove();
    generatePalette();
}

// Handle changes to the number of blocks
function handleNumBlocksInputChange() {
    const newNumBlocks = Number(numBlocksInput.value);
    if (newNumBlocks >= 1 && newNumBlocks <= 20) {
        numBlocks = newNumBlocks;
        generatePalette();
    } else {
        numBlocksInput.value = numBlocks; // Reset the input value if it's out of range
    }
}

// Generate the color palette
function generatePalette() {
    const rows = document.querySelectorAll(".color-row");
    for (row of rows) {
        const numBlocksInput = row.querySelector(".numBlocks");
        let numBlocks = Number(numBlocksInput.value);
        const colorPickers = Array.from(row.getElementsByClassName("colorPicker"));
        const pickedColors = colorPickers.map((picker) => picker.value);
        const numColors = pickedColors.length;
        row.querySelector(".palette").innerHTML = "";
        if (numColors === 1) {
            const lightnessMin = row.querySelector(".lightnessMin").value / 100;
            const lightnessMax = row.querySelector(".lightnessMax").value / 100;
            for (let i = 0; i < numBlocks; i++) {
                // Here
                let color;
                const ratio = i / numBlocks; // And here

                // First half of the colors (from white to the chosen color)
                if (ratio < 0.5) {
                    const lightness = lightnessMin + (1 - lightnessMin) * (ratio * 2);
                    color = color2k.mix("white", pickedColors[0], lightness);
                }
                // At the midpoint, use the chosen color
                else if (ratio === 0.5) {
                    color = pickedColors[0];
                    createColorDiv(color, row, true); // pass true to mark this as the current color
                    continue;
                }
                // Second half of the colors (from the chosen color to black)
                else {
                    const lightness = lightnessMax * ((ratio - 0.5) * 2);
                    color = color2k.mix(pickedColors[0], "black", lightness);
                }

                createColorDiv(color, row);
            }
        } else {
            // If there are multiple colors, iterate one less time
            for (let i = 0; i < numBlocks - 1; i++) {
                const colorIndex = Math.floor(i / (numBlocks / (numColors - 1)));
                const color1 = pickedColors[colorIndex % numColors];
                const color2 = pickedColors[Math.min(colorIndex + 1, numColors - 1)];

                const ratio =
                    (i % (numBlocks / (numColors - 1))) / (numBlocks / (numColors - 1));

                const color = color2k.mix(color1, color2, ratio);

                createColorDiv(color, row);
            }
            // Add the last color
            createColorDiv(pickedColors[numColors - 1], row);
        }
    }
}

// Convert RGBA to HEX color
function rgbaToHex(rgba) {
    const match = rgba.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );
    const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}

// Create a color div
function createColorDiv(color, row, isCurrentColor = false) {
    // Don't create the color div if the color is white or black
    if (color === "rgb(0, 0, 0)" || color === "rgb(255, 255, 255)") {
        return;
    }

    const colorDiv = document.createElement("div");
    colorDiv.className = "colorDiv flex justify-center items-end p-2 h-[80px] grow";
    if (isCurrentColor) {
        colorDiv.classList.add("current-color");
    }

    colorDiv.style.backgroundColor = color;

    const colorValue = document.createElement("div");
    colorValue.className = "colorValue text-sm";

    // If the color is in RGB or RGBA format, convert it to HEX
    if (color.startsWith("rgb")) {
        color = rgbaToHex(color);
    }

    // Check contrast and change text color to white if needed
    if (getContrast(color) < 4.5) {
        colorValue.style.color = "rgb(255, 255, 255)";
    }

    colorValue.textContent = color;
    colorDiv.appendChild(colorValue);

    row.querySelector(".palette").appendChild(colorDiv);
}

function getContrast(hexColor) {
    // Convert HEX to RGB
    const [r, g, b] = hexToRgb(hexColor);

    // Calculate the relative luminance
    const L = 0.2126 * Math.pow(r / 255, 2.2) +
        0.7152 * Math.pow(g / 255, 2.2) +
        0.0722 * Math.pow(b / 255, 2.2);

    // Compare it with the relative luminance of black
    const contrast = (L + 0.05) / (0.0 + 0.05);

    return contrast;
}

function hexToRgb(hexColor) {
    const bigint = parseInt(hexColor.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

function DuplicateColorRow() {
    var rows = document.querySelectorAll('.color-row');
    var row = rows[rows.length - 1];
    let clone = row.cloneNode(true);
    row.after(clone);
    var input = clone.querySelector('.input.color-name');
    input.value = input.value + ' (copy)';
    clone.querySelector(".addColorPickerButton").addEventListener("click", addColorPicker);
    clone.querySelector(".lightnessMin").addEventListener("change", generatePalette);
    clone.querySelector(".lightnessMax").addEventListener("change", generatePalette);
    clone.querySelector(".numBlocks").addEventListener("change", handleNumBlocksInputChange);
    clone.querySelector(".delete-row-color").addEventListener("click", DeleteColorRow);
    clone.querySelector(".shadesCheckbox").addEventListener("click", ToggleColorShades);
    const colorPickers = clone.getElementsByClassName("colorPicker");
    for (const picker of colorPickers) {
        picker.addEventListener("change", handleColorPickerChange);
        const pickerValue = picker.nextElementSibling;
        pickerValue.addEventListener("change", handleColorPickerValueChange);
    }
    const deleteButtons = clone.querySelectorAll(".colorPickerContainer button");
    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", handleDeleteButtonClick);
    }
    generatePalette();

}

function DeleteColorRow(event) {
    var rows = document.querySelectorAll('.color-row');
    if (rows.length > 1) { 
        const ColorRow = event.currentTarget.closest(".color-row");
        ColorRow.remove();
    }
}

function ToggleColorShades(event) {
    const ColorRow = event.currentTarget.closest(".color-row");
    if (event.currentTarget.checked == false) {
        ColorRow.querySelector(".palette").style.display = "none";
        ColorRow.querySelector(".addColorPickerButton").style.display = "none";
        ColorRow.querySelector(".advanced-s").style.display = "none";
    } else {
        ColorRow.querySelector(".palette").style.display = "flex";
        ColorRow.querySelector(".addColorPickerButton").style.display = "block";
        ColorRow.querySelector(".advanced-s").style.display = "flex";
    }
}
