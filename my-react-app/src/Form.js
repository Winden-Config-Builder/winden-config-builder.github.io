import React, { useState, useEffect } from 'react';

const Form = () => {
  const [minBaseFontSize, setMinBaseFontSize] = useState(10);
  const [minScreenWidth, setMinScreenWidth] = useState(300);
  const [minScaleRatio, setMinScaleRatio] = useState(1.2);
  const [maxBaseFontSize, setMaxBaseFontSize] = useState(15);
  const [maxScreenWidth, setMaxScreenWidth] = useState(1600);
  const [maxScaleRatio, setMaxScaleRatio] = useState(1.4);
  const [typeScaleNames, setTypeScaleNames] = useState('sm, md, base, lg, xl, xxl');
  const [rounding, setRounding] = useState(4);
  const [disableRatio, setDisableRatio] = useState(false);
  const [baseLineSelect, setBaseLineSelect] = useState('');

  useEffect(() => {
    updateSelectOptions();
  }, [typeScaleNames]);

  const updateValues = () => {
    return {
      minBaseFontSize: parseFloat(minBaseFontSize),
      minScreenWidth: parseFloat(minScreenWidth),
      minScaleRatio: parseFloat(minScaleRatio),
      maxBaseFontSize: parseFloat(maxBaseFontSize),
      maxScreenWidth: parseFloat(maxScreenWidth),
      maxScaleRatio: parseFloat(maxScaleRatio),
      typeScaleNames: typeScaleNames.split(',').map((name) => name.trim()),
      decimalPlaces: parseInt(rounding),
    };
  };

  const generate = () => {
    const values = updateValues();
    let cssVariables = '';
    let tailwindVarPreview = 'fontSize: {\n';
    let tailwindPreview = 'fontSize: {\n';

    const selectIndex = baseLineSelect ? parseInt(baseLineSelect) : 0;

    // Calculate font sizes
    let fontSizes = [];
    if (disableRatio) {
      const sizes = document.querySelectorAll('.typographySingleWrap .input-group');
      for (let i = 0; i < sizes.length; i++) {
        const minFontSize = Number(sizes[i].querySelector('#minScaleRatio').value);
        const maxFontSize = Number(sizes[i].querySelector('#maxScaleRatio').value);
        const vwValue = ((maxFontSize - minFontSize) * 100) / (values.maxScreenWidth - values.minScreenWidth);
        const pxValue = minFontSize - (values.minScreenWidth * vwValue) / 100;

        const typeScaleName = sizes[i].querySelector('#maxScaleName').value || i;
        const cssVariable = `--win-fs-${typeScaleName}`;

        // Add to font sizes array
        fontSizes.push({
          typeScaleName,
          minFontSize,
          maxFontSize,
          vwValue,
          pxValue,
          cssVariable,
        });

        cssVariables += `${cssVariable}: clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(
          values.decimalPlaces
        )}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

        // Add entries to tailwind var preview
        tailwindVarPreview += `  ${typeScaleName}: 'var(${cssVariable})',\n`;

        // Add entries to tailwind preview
        tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(
          values.decimalPlaces
        )}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
      }
    } else {
      for (let i = 0; i < values.typeScaleNames.length; i++) {
        const base = selectIndex > 0 ? i - selectIndex : i;
        const minFontSize = values.minBaseFontSize * Math.pow(values.minScaleRatio, base);
        const maxFontSize = values.maxBaseFontSize * Math.pow(values.maxScaleRatio, base);

        const vwValue = ((maxFontSize - minFontSize) * 100) / (values.maxScreenWidth - values.minScreenWidth);
        const pxValue = minFontSize - (values.minScreenWidth * vwValue) / 100;

        const typeScaleName = values.typeScaleNames[i].trim();
        const cssVariable = `--win-fs-${typeScaleName}`;

        // Add to font sizes array
        fontSizes.push({
          typeScaleName,
          minFontSize,
          maxFontSize,
          vwValue,
          pxValue,
          cssVariable,
        });

        cssVariables += `${cssVariable}: clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(
          values.decimalPlaces
        )}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

        // Add entries to tailwind var preview
        tailwindVarPreview += `  ${typeScaleName}: 'var(${cssVariable})',\n`;

        // Add entries to tailwind preview
        tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(
          values.decimalPlaces
        )}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
      }
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

    document.querySelector('#css-variables-preview code').textContent = wrappedCSSVariables;
    document.querySelector('#tailwind-var-preview code').textContent = `${tailwindVarPreview}}`;
    document.querySelector('#tailwind-preview code').textContent = `${tailwindPreview}}`;

    // Update font preview
    const fontBlock = document.querySelector('.font-preview');
    fontBlock.innerHTML = '';
    fontSizes.forEach(({ typeScaleName }) => {
      const p = document.createElement('p');
      p.innerHTML = 'Lorem ipsum';
      p.classList.add(typeScaleName);
      p.style.fontSize = `var(--win-fs-${typeScaleName})`;
      fontBlock.append(p);
    });
  };

  const updateSelectOptions = () => {
    const typeScaleNamesArray = typeScaleNames.split(',').map((name) => name.trim());
    setBaseLineSelect(typeScaleNamesArray.length > 0 ? '0' : '');
  };

  const handleDisableRatioChange = (e) => {
    setDisableRatio(e.target.checked);
  };

  const handleAddFontClick = () => {
    const typographySingleWrap = document.querySelector('#typographySingle .typographySingleWrap');
    const inputGroup = document.querySelector('#typographySingle .input-group');
    const clonedInputGroup = inputGroup.cloneNode(true);

    const delFontButton = clonedInputGroup.querySelector('.delFont');
    delFontButton.addEventListener('click', () => {
      clonedInputGroup.remove();
      generate();
    });

    typographySingleWrap.appendChild(clonedInputGroup);
    generate();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'minBaseFontSize':
        setMinBaseFontSize(value);
        break;
      case 'minScreenWidth':
        setMinScreenWidth(value);
        break;
      case 'minScaleRatio':
        setMinScaleRatio(value);
        break;
      case 'maxBaseFontSize':
        setMaxBaseFontSize(value);
        break;
      case 'maxScreenWidth':
        setMaxScreenWidth(value);
        break;
      case 'maxScaleRatio':
        setMaxScaleRatio(value);
        break;
      case 'typeScaleNames':
        setTypeScaleNames(value);
        break;
      case 'rounding':
        setRounding(value);
        break;
      case 'baseLineSelect':
        setBaseLineSelect(value);
        break;
      default:
        break;
    }
  };

  return (
    <div id="form">
      <h1>Screen width</h1>
      <div className="input-group">
        <div className="input-wrap">
          <label htmlFor="minScreenWidth">Mobile (Min)</label>
          <input type="number" id="minScreenWidth" value={minScreenWidth} onChange={handleInputChange} />
        </div>
        <div className="input-wrap">
          <label htmlFor="maxScreenWidth">Desktop (Max)</label>
          <input type="number" id="maxScreenWidth" value={maxScreenWidth} onChange={handleInputChange} />
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label htmlFor="disableRatio" style={{ display: 'block', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="disableRatio"
            name="disableRatio"
            style={{ verticalAlign: 'middle' }}
            checked={disableRatio}
            onChange={handleDisableRatioChange}
          />
          <span>Disable Ratio</span>
        </label>
      </div>

      {!disableRatio ? (
        <div id="typographyRatio">
          <h1>Base Font Size</h1>
          <div className="input-group">
            <div className="input-wrap">
              <label htmlFor="minBaseFontSize">Mobile (Min)</label>
              <input type="number" id="minBaseFontSize" value={minBaseFontSize} onChange={handleInputChange} />
            </div>
            <div className="input-wrap">
              <label htmlFor="maxBaseFontSize">Desktop (Max)</label>
              <input type="number" id="maxBaseFontSize" value={maxBaseFontSize} onChange={handleInputChange} />
            </div>
          </div>

          <h1>Type scale ratio</h1>
          <div className="input-group">
            <div className="input-wrap">
              <label htmlFor="minScaleRatio">Mobile (Min)</label>
              <input type="number" id="minScaleRatio" value={minScaleRatio} onChange={handleInputChange} />
            </div>
            <div className="input-wrap">
              <label htmlFor="maxScaleRatio">Desktop (Max)</label>
              <input type="number" id="maxScaleRatio" value={maxScaleRatio} onChange={handleInputChange} />
            </div>
          </div>

          <h1>Type scale name</h1>
          <p>Prodivide a comma-separated list of names.</p>
          <div className="input-group">
            <div className="input-wrap">
              <label htmlFor="typeScaleNames">Names</label>
              <input type="text" id="typeScaleNames" value={typeScaleNames} onChange={handleInputChange} />
            </div>
            <div className="input-wrap">
              <label htmlFor="baseLineSelect">Baseline Step</label>
              <select name="baseLineSelect" id="baseLineSelect" value={baseLineSelect} onChange={handleInputChange}>
                <option value="">None</option>
                {typeScaleNames.split(',').map((name, index) => (
                  <option key={index} value={index}>
                    {name.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div id="typographySingle" style={{ display: 'none' }}>
          <h1>Fluid sizes</h1>
          <div className="typographySingleWrap">
            <div className="input-group">
              <div className="input-wrap">
                <label htmlFor="minScaleRatio">Mobile Size</label>
                <input type="number" onInput={generate} id="minScaleRatio" value={minScaleRatio} />
              </div>
              <div className="input-wrap">
                <label htmlFor="maxScaleRatio">Desktop Size</label>
                <input type="number" onInput={generate} id="maxScaleRatio" value={maxScaleRatio} />
              </div>
              <div className="input-wrap">
                <label htmlFor="maxScaleRatio">Name</label>
                <input type="text" onInput={generate} id="maxScaleName" />
              </div>
              <button className="delFont">Del</button>
            </div>
          </div>
          <button className="AddFont" style={{ marginTop: '10px' }} onClick={handleAddFontClick}>
            + Add new
          </button>
        </div>
      )}

      <h1>Rounding</h1>
      <p>The maximum number of decimal places in the output.</p>
      <input type="number" id="rounding" value={rounding} onChange={handleInputChange} />
    </div>
  );
};

export default Form;
