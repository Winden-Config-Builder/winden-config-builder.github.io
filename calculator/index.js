function generate() {
  let minBaseFontSize = parseFloat(document.getElementById('minBaseFontSize').value);
  let minScreenWidth = parseFloat(document.getElementById('minScreenWidth').value);
  let minScaleRatio = parseFloat(document.getElementById('minScaleRatio').value);

  let maxBaseFontSize = parseFloat(document.getElementById('maxBaseFontSize').value);
  let maxScreenWidth = parseFloat(document.getElementById('maxScreenWidth').value);
  let maxScaleRatio = parseFloat(document.getElementById('maxScaleRatio').value);

  let typeScaleNames = document.getElementById('typeScaleNames').value.split(',');
  let decimalPlaces = parseInt(document.getElementById('rounding').value);

  let cssVariables = "";

  for (let i = 0; i < typeScaleNames.length; i++) {
    let minFontSize = minBaseFontSize * Math.pow(minScaleRatio, i);
    let maxFontSize = maxBaseFontSize * Math.pow(maxScaleRatio, i);

    let vwValue = ((maxFontSize - minFontSize) * 100) / (maxScreenWidth - minScreenWidth);
    let pxValue = minFontSize - (minScreenWidth * vwValue / 100);

    cssVariables += `--${typeScaleNames[i].trim()}: clamp(${minFontSize.toFixed(decimalPlaces)}px, ${vwValue.toFixed(decimalPlaces)}vw + ${pxValue.toFixed(decimalPlaces)}px, ${maxFontSize.toFixed(decimalPlaces)}px);\n`;
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

// Event listeners for all input fields
document.getElementById('minBaseFontSize').addEventListener('input', generate);
document.getElementById('minScreenWidth').addEventListener('input', generate);
document.getElementById('minScaleRatio').addEventListener('input', generate);
document.getElementById('maxBaseFontSize').addEventListener('input', generate);
document.getElementById('maxScreenWidth').addEventListener('input', generate);
document.getElementById('maxScaleRatio').addEventListener('input', generate);
document.getElementById('typeScaleNames').addEventListener('input', generate);
document.getElementById('rounding').addEventListener('input', generate);

// Generate CSS variables on page load
window.addEventListener('load', generate);
