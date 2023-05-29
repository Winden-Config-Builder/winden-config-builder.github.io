function updateValues() {
  return {
    minScreenWidth: parseFloat(document.querySelector(".minScreenWidth").value),
    maxScreenWidth: parseFloat(document.querySelector(".maxScreenWidth").value),
    minBaseFontSize: parseFloat(
      document.querySelector(".minBaseFontSize").value
    ),
    maxBaseFontSize: parseFloat(
      document.querySelector(".maxBaseFontSize").value
    ),
    minScaleRatio: parseFloat(document.querySelector(".minScaleRatio").value),
    typeScaleNames: document.querySelector(".typeScaleNames").value.split(","),
    maxScaleRatio: parseFloat(document.querySelector(".maxScaleRatio").value),
    decimalPlaces: parseInt(document.querySelector(".rounding").value),
  };
}

function generate() {
  let values = updateValues();
  let cssVariables = "";
  let tailwindVarPreview = "fontSize: {\n";
  let tailwindPreview = "fontSize: {\n";
  let select = document.querySelector(".baseLineSelect");
  let index = select.selectedIndex;
  let fontBlock = document.querySelector(".font-preview");
  fontBlock.innerHTML = "";

  // if disableRatio selected
  if (document.querySelector(".disableRatio").checked) {
    var sizes = document.querySelectorAll(".typographySingleWrap .input-group");
    for (let i = 0; i < sizes.length; i++) {
      let minFontSize = Number(sizes[i].querySelector(".minScaleRatio").value);
      let maxFontSize = Number(sizes[i].querySelector(".maxScaleRatio").value);
      let vwValue =
        ((maxFontSize - minFontSize) * 100) /
        (values.maxScreenWidth - values.minScreenWidth);
      let pxValue = minFontSize - (values.minScreenWidth * vwValue) / 100;

      let typeScaleName = sizes[i].querySelector(".maxScaleName").value
        ? sizes[i].querySelector(".maxScaleName").value
        : i;
      let cssVariable = `--win-fs-${typeScaleName}`;

      // custom lorem ipsum
      var p = document.createElement("p");
      p.innerHTML = "Lorem ipsum";
      p.classList.add(typeScaleName);
      p.style.fontSize = "var(--win-fs-" + typeScaleName + ")";
      fontBlock.append(p);

      cssVariables += `${cssVariable}: clamp(${minFontSize.toFixed(
        values.decimalPlaces
      )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
        values.decimalPlaces
      )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

      // Add entries to tailwind var preview
      tailwindVarPreview += `  ${typeScaleName}: 'var(${cssVariable})',\n`;

      // Add entries to tailwind preview
      tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(
        values.decimalPlaces
      )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
        values.decimalPlaces
      )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
    }
  } else {
    for (let i = 0; i < values.typeScaleNames.length; i++) {
      if (index > 0) {
        var base = i - index;
      } else {
        var base = i;
      }
      let minFontSize =
        values.minBaseFontSize * Math.pow(values.minScaleRatio, base);
      let maxFontSize =
        values.maxBaseFontSize * Math.pow(values.maxScaleRatio, base);

      let vwValue =
        ((maxFontSize - minFontSize) * 100) /
        (values.maxScreenWidth - values.minScreenWidth);
      let pxValue = minFontSize - (values.minScreenWidth * vwValue) / 100;

      let typeScaleName = values.typeScaleNames[i].trim();
      let cssVariable = `--win-fs-${typeScaleName}`;

      // custom lorem ipsum
      var p = document.createElement("p");
      p.innerHTML = "Lorem ipsum";
      p.classList.add(typeScaleName);
      p.style.fontSize = "var(--win-fs-" + typeScaleName + ")";
      fontBlock.append(p);

      cssVariables += `${cssVariable}: clamp(${minFontSize.toFixed(
        values.decimalPlaces
      )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
        values.decimalPlaces
      )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

      // Add entries to tailwind var preview
      tailwindVarPreview += `  ${typeScaleName}: 'var(${cssVariable})',\n`;

      // Add entries to tailwind preview
      tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(
        values.decimalPlaces
      )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
        values.decimalPlaces
      )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
    }
  }

  const wrappedCSSVariables = `:root {\n${cssVariables}}`;

  const styleTag = document.getElementById("generated-styles");
  if (styleTag) {
    styleTag.textContent = wrappedCSSVariables;
  } else {
    const head = document.head || document.getElementsByTagName("head")[0];
    const newStyleTag = document.createElement("style");
    newStyleTag.setAttribute("id", "generated-styles");
    newStyleTag.textContent = wrappedCSSVariables;
    head.appendChild(newStyleTag);
  }

  document.querySelector("#css-variables-preview code").textContent =
    wrappedCSSVariables;
  document.querySelector(
    "#tailwind-var-preview code"
  ).textContent = `${tailwindVarPreview}}`;
  document.querySelector(
    "#tailwind-preview code"
  ).textContent = `${tailwindPreview}}`;
}

function updateSelectOptions() {
	let typeScaleNames = document
	  .querySelector(".typeScaleNames")
	  .value.split(/\s*,\s*/);
	let select = document.querySelector(".baseLineSelect");
  
	// clear out old options
	while (select.firstChild) {
	  select.firstChild.remove();
	}
  
	// create and append new options
	for (let i = 0; i < typeScaleNames.length; i++) {
	  let option = document.createElement("option");
	  option.value = typeScaleNames[i];
	  option.text = typeScaleNames[i];
	  select.appendChild(option);
	}
  }
  

let inputClasses = [
  "minBaseFontSize",
  "minScreenWidth",
  "minScaleRatio",
  "maxBaseFontSize",
  "maxScreenWidth",
  "maxScaleRatio",
  "typeScaleNames",
  "rounding",
  "baseLineSelect",
];

inputClasses.forEach((className) => {
  let elements = document.getElementsByClassName(className);

  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("input", () => {
      if (className === "typeScaleNames") {
        updateSelectOptions();
      }
      generate();
    });
  }
});

let inputs = document.querySelectorAll(".input");
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    generate();
  });
});

// Generate CSS variables and update select options on page load
window.addEventListener("load", function () {
  updateSelectOptions();
  generate();
});

document
  .getElementsByClassName("disableRatio")[0]
  .addEventListener("change", function () {
    let typographyRatio = document.getElementsByClassName("typographyRatio")[0];
    let typographySingle =
      document.getElementsByClassName("typographySingle")[0];

    if (this.checked) {
      typographyRatio.style.display = "none";
      typographySingle.style.display = "block";
    } else {
      typographyRatio.style.display = "block";
      typographySingle.style.display = "none";
    }
    generate();
  });

// Event listener for "AddFont" button
document.querySelector(".AddFont").addEventListener("click", function () {
  let typographySingleWrap = document.querySelector(
    "#typographySingle .typographySingleWrap"
  );
  let inputGroup = document.querySelector("#typographySingle .input-group");
  let clonedInputGroup = inputGroup.cloneNode(true); // This creates a copy of the inputGroup

  // Make sure to add an event listener to the cloned "delFont" button
  let delFontButton = clonedInputGroup.querySelector(".delFont");
  delFontButton.addEventListener("click", function () {
    this.closest(".input-group").remove();
    generate();
  });

  typographySingleWrap.appendChild(clonedInputGroup); // This adds the copy to the DOM
  generate();
});

// Event listener for initial "delFont" button
let delFontButtons = document.querySelectorAll(".delFont");
delFontButtons.forEach((button) => {
  button.addEventListener("click", function () {
    this.closest(".input-group").remove();
  });
});
