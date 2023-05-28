// DOM elements
const colorPickerContainer = document.getElementById("colorPickerContainer");
const lightnessMinInput = document.getElementById("lightnessMin");
const lightnessMaxInput = document.getElementById("lightnessMax");
const numBlocksInput = document.getElementById("numBlocks");
const paletteDiv = document.getElementById("palette");

// Configuration
let numBlocks = Number(numBlocksInput.value);

// Event listeners
window.addEventListener("load", generatePalette);
document.getElementById("addColorPickerButton").addEventListener("click", addColorPicker);
lightnessMinInput.addEventListener("change", generatePalette);
lightnessMaxInput.addEventListener("change", generatePalette);
numBlocksInput.addEventListener("change", handleNumBlocksInputChange);

// Handles color picker change
function handleColorPickerChange(event) {
  const picker = event.target;
  const pickerValue = picker.nextSibling;
  pickerValue.value = picker.value;
  generatePalette();
}

// Handles color picker value change
function handleColorPickerValueChange(event) {
  const pickerValue = event.target;
  const picker = pickerValue.previousSibling;
  picker.value = pickerValue.value;
  generatePalette();
}

// Handles the creation of new color pickers
function addColorPicker() {
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
  const colorPickerWrap = event.target.parentNode.parentNode;
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

// Handle the creation of new color pickers
function handleAddColorPickerButtonClick() {
  const colorPickerContainer = document.getElementById("colorPickerContainer");

  const colorPickerWrap = document.createElement("div");
  colorPickerWrap.className = "colorPickerWrap";

  const label = document.createElement("label");
  label.textContent = "Color";

  const flex = document.createElement("div");
  flex.className = "flex";

  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.className = "colorPicker";
  colorPicker.value = "#ff0000";
  colorPicker.addEventListener("change", handleColorPickerChange);

  const colorPickerValue = document.createElement("input");
  colorPickerValue.type = "text";
  colorPickerValue.className = "colorPickerValue";
  colorPickerValue.value = "#ff0000";
  colorPickerValue.addEventListener("change", handleColorPickerValueChange);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Remove";
  deleteButton.addEventListener("click", handleDeleteButtonClick);

  flex.appendChild(colorPicker);
  flex.appendChild(colorPickerValue);
  flex.appendChild(deleteButton);
  colorPickerWrap.appendChild(label);
  colorPickerWrap.appendChild(flex);
  colorPickerContainer.appendChild(colorPickerWrap);

  generatePalette();
}

// Handle the removal of color pickers
function handleDeleteButtonClick(event) {
  const colorPickerWrap = event.target.closest(".colorPickerWrap");
  colorPickerWrap.remove();
  generatePalette();
}


// Generate the color palette
function generatePalette() {
  const colorPickers = Array.from(
    document.getElementsByClassName("colorPicker")
  );
  const pickedColors = colorPickers.map((picker) => picker.value);
  const numColors = pickedColors.length;

  // Clear existing palette
  paletteDiv.innerHTML = "";

  if (numColors === 1) {
    const lightnessMin = lightnessMinInput.value / 100;
    const lightnessMax = lightnessMaxInput.value / 100;

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
        createColorDiv(color, true); // pass true to mark this as the current color
        continue;
      }
      // Second half of the colors (from the chosen color to black)
      else {
        const lightness = lightnessMax * ((ratio - 0.5) * 2);
        color = color2k.mix(pickedColors[0], "black", lightness);
      }

      createColorDiv(color);
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

      createColorDiv(color);
    }
    // Add the last color
    createColorDiv(pickedColors[numColors - 1]);
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
function createColorDiv(color, isCurrentColor = false) {
  // Don't create the color div if the color is white or black
  if (color === "rgb(0, 0, 0)" || color === "rgb(255, 255, 255)") {
    return;
  }

  const colorWrap = document.createElement("div");
  colorWrap.className = "colorWrap";
  if (isCurrentColor) {
    colorWrap.classList.add("current-color");
  }

  const colorDiv = document.createElement("div");
  colorDiv.className = "colorDiv";
  colorDiv.style.backgroundColor = color;
  colorWrap.appendChild(colorDiv);

  const colorValue = document.createElement("div");
  colorValue.className = "colorValue";

  // If the color is in RGB or RGBA format, convert it to HEX
  if (color.startsWith("rgb")) {
    color = rgbaToHex(color);
  }

  colorValue.textContent = color;
  colorDiv.appendChild(colorValue);

  paletteDiv.appendChild(colorWrap);
}

