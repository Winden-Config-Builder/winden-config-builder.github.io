var colorPicker = document.getElementById("colorPicker");
var shadesContainer = document.getElementById("shadesContainer");
var shades = [];
var selectedIndex = null;
var numBlocks = 10; // Initial number of blocks

colorPicker.addEventListener("change", generateShades);

generateShades(); // Generate shades when the page loads

function generateShades() {
    shadesContainer.innerHTML = "";
    var baseColor = chroma(colorPicker.value);
    shades = chroma.scale([baseColor.darken(), baseColor, baseColor.brighten()]).mode("lab").colors(numBlocks);
  
    shades.forEach(function (shade, index) {
      var shadeElement = document.createElement("div");
      shadeElement.style.backgroundColor = shade;
      shadeElement.className = "shade";
      shadeElement.textContent = chroma(shade).hex(); // Set the hex value as text content
  
      shadeElement.addEventListener("click", function () {
        setSelectedShade(index);
      });
  
      shadesContainer.appendChild(shadeElement);
    });
  
    // Reapply the selected shade if one is currently selected
    if (selectedIndex !== null) {
      setSelectedShade(selectedIndex);
    }
  }
  

function setSelectedShade(index) {
  var selectedColor = chroma(colorPicker.value).hex();

  // Remove the style from the previously selected shade
  if (selectedIndex !== null) {
    shadesContainer.childNodes[selectedIndex].style.border = "";
    shadesContainer.childNodes[selectedIndex].style.zIndex = "";
  }

  // Set the style for the selected shade
  shadesContainer.childNodes[index].style.backgroundColor = selectedColor;
  shadesContainer.childNodes[index].style.border = "2px solid black";
  shadesContainer.childNodes[index].style.zIndex = "1";

  for (var i = 0; i < shadesContainer.childNodes.length; i++) {
    if (i < index) {
      shadesContainer.childNodes[i].style.backgroundColor = chroma(selectedColor).darken((index - i) / 2).hex();
    } else if (i > index) {
      shadesContainer.childNodes[i].style.backgroundColor = chroma(selectedColor).brighten((i - index) / 2).hex();
    }
  }

  // Update the selectedIndex
  selectedIndex = index;
}

var addButton = document.getElementById("addButton");
var removeButton = document.getElementById("removeButton");

addButton.addEventListener("click", addBlock);
removeButton.addEventListener("click", removeBlock);

function addBlock() {
  numBlocks++;
  generateShades();
}

function removeBlock() {
  if (numBlocks > 1) {
    numBlocks--;
    if (selectedIndex !== null && selectedIndex >= numBlocks) {
      // If the selected index is out of range after removing a block,
      // update it to the last available index
      selectedIndex = numBlocks - 1;
    }
    generateShades();
  }
}