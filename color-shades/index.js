// Cache DOM elements
var colorPicker = document.getElementById("colorPicker");
var shadesContainer = document.getElementById("shadesContainer");
var addButton = document.getElementById("addButton");
var removeButton = document.getElementById("removeButton");
var hueInput = document.getElementById("hue");
var colorNameInput = document.querySelector('input[type="text"]');
var previewCode = document.querySelector('#preview code');
var debounceTimer = null;
var hueDebounceTimer = null;
var shades = [];
var selectedIndex = null;
var numBlocks = 10; // Initial number of blocks

// Event listener for colorPicker change
colorPicker.addEventListener("change", function() {
  generateShades();
  setColorName();
  exportColors();
});

// Event listener for addButton click
addButton.addEventListener("click", function() {
  addBlock();
  exportColors();
});

// Event listener for removeButton click
removeButton.addEventListener("click", function() {
  removeBlock();
  exportColors();
});

// Event listener for colorNameInput input with debounce
colorNameInput.addEventListener('input', function() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(exportColors, 500); // Adjust the debounce delay as needed
});

// Event listener for hueInput input with debounce
hueInput.addEventListener('input', function() {
  clearTimeout(hueDebounceTimer);
  hueDebounceTimer = setTimeout(function() {
    setColorWithHue();
    generateShades();
    setColorName();
    exportColors();
  }, 200); // Adjust the debounce delay as needed
});

// Generate shades when the page loads
generateShades();
setColorName();
exportColors();

function generateShades() {
  shadesContainer.innerHTML = "";
  var baseColor = chroma(colorPicker.value);
  shades = chroma.scale(['white', baseColor, 'black']).mode("lab").colors(numBlocks);
  
  shades.forEach(function (shade, index) {
    var shadeElement = document.createElement("div");
    shadeElement.style.backgroundColor = shade;
    shadeElement.className = "shade";
    shadeElement.textContent = chroma(shade).hex();
  
    shadeElement.addEventListener("click", function () {
      setSelectedShade(index);
    });
  
    shadesContainer.appendChild(shadeElement);
  });
  
  if (selectedIndex !== null) {
    setSelectedShade(selectedIndex);
  }
}

function setSelectedShade(index) {
  var selectedColor = chroma(colorPicker.value).hex();
  
  if (selectedIndex !== null) {
    shadesContainer.childNodes[selectedIndex].classList.remove("active-color");
  }
  
  shadesContainer.childNodes[index].style.backgroundColor = selectedColor;
  shadesContainer.childNodes[index].classList.add("active-color");
  
  for (var i = 0; i < shadesContainer.childNodes.length; i++) {
    var shade;
    if (i < index) {
      shade = chroma(selectedColor).brighten((index - i) / 2).hex();
    } else if (i > index) {
      shade = chroma(selectedColor).darken((i - index) / 2).hex();
    } else {
      shade = selectedColor;
    }
    shadesContainer.childNodes[i].style.backgroundColor = shade;
    shadesContainer.childNodes[i].textContent = shade;
  }
  
  selectedIndex = index;
  exportColors();
}

function addBlock() {
  numBlocks++;
  generateShades();
}

function removeBlock() {
  if (numBlocks > 1) {
    numBlocks--;
    if (selectedIndex !== null && selectedIndex >= numBlocks) {
      selectedIndex = numBlocks - 1;
    }
    generateShades();
    exportColors();
  }
}

function setColorName() {
    var colorName = chroma(colorPicker.value).name();
    colorNameInput.value = colorName;
  }
  
  function exportColors() {
    var colorName = colorNameInput.value;
    var output = "colors: {\n";
    output += "  '" + colorName + "': {\n";
  
    shades.forEach(function (shade, index) {
      output += "    " + ((index + 1) * 100) + ": '" + chroma(shade).hex() + "',\n";
    });
  
    output += "  },\n}";
  
    previewCode.textContent = output;
  }
  
  function setColorWithHue() {
    var hueValue = hueInput.value;
    var baseColor = chroma(colorPicker.value);
    var colorWithHue = baseColor.set('hsl.h', hueValue);
  
    colorPicker.value = colorWithHue.hex();
  }
  
  // Set the color name to "custom-color" when the page loads
  colorNameInput.value = "custom-color";
  exportColors();
  