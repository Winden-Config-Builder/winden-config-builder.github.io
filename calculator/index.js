function updateValues() {
  return {
    minBaseFontSize: parseFloat(document.getElementById('minBaseFontSize').value),
    minScreenWidth: parseFloat(document.getElementById('minScreenWidth').value),
    minScaleRatio: parseFloat(document.getElementById('minScaleRatio').value),
    maxBaseFontSize: parseFloat(document.getElementById('maxBaseFontSize').value),
    maxScreenWidth: parseFloat(document.getElementById('maxScreenWidth').value),
    maxScaleRatio: parseFloat(document.getElementById('maxScaleRatio').value),
    typeScaleNames: document.getElementById('typeScaleNames').value.split(','),
    decimalPlaces: parseInt(document.getElementById('rounding').value),
  };
}

function generate() {
  let values = updateValues();
  let cssVariables = "";
  let select = document.getElementById('baseLineSelect');
  let index = select.selectedIndex;

  for (let i = 0; i < values.typeScaleNames.length; i++) {
	if (index > 0){
		var base = i - index;
	} else {
		var base = i;
	}
	let minFontSize = values.minBaseFontSize * Math.pow(values.minScaleRatio, base);
	let maxFontSize = values.maxBaseFontSize * Math.pow(values.maxScaleRatio, base);

	let vwValue = ((maxFontSize - minFontSize) * 100) / (values.maxScreenWidth - values.minScreenWidth);
	let pxValue = minFontSize - (values.minScreenWidth * vwValue / 100);
		
	cssVariables += `--${values.typeScaleNames[i].trim()}: clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

    
  }

  const wrappedCSSVariables = `:root {\n${cssVariables}}`;

  const styleTag = document.getElementById('generated-styles');
  if (styleTag) {
    styleTag.textContent = wrappedCSSVariables;
  } else {
    const head = document.head || document.getElementsByTagName('head')[0];
    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute('id', 'generated-styles');
    newStyleTag.textContent = wrappedCSSVariables;
    head.appendChild(newStyleTag);
  }

  document.querySelector('#preview code').textContent = wrappedCSSVariables;
}

function updateSelectOptions() {
  let typeScaleNames = document.getElementById('typeScaleNames').value.split(/\s*,\s*/);
  let select = document.getElementById('baseLineSelect');

  // clear out old options
  while (select.firstChild) {
    select.firstChild.remove();
  }

  // create and append new options
  for (let i = 0; i < typeScaleNames.length; i++) {
    let option = document.createElement('option');
    option.value = typeScaleNames[i];
    option.text = typeScaleNames[i];
    select.appendChild(option);
  }
}

// Event listeners for all input fields
let inputIds = ['minBaseFontSize', 'minScreenWidth', 'minScaleRatio', 'maxBaseFontSize', 'maxScreenWidth', 'maxScaleRatio', 'typeScaleNames', 'rounding', 'baseLineSelect'];

inputIds.forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (id === 'typeScaleNames') {
      updateSelectOptions();
    }
    generate();
  });
});

// Generate CSS variables and update select options on page load
window.addEventListener('load', function() {
  updateSelectOptions();
  generate();
});
