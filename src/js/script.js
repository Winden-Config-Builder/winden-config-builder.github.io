// ************************************************************
// Add and Delete Rows for repeatable fields
// ************************************************************

// Function to handle adding new rows
function addNewRow(event) {
    const addButton = event.target;
    const repeatebleFields = addButton.parentNode;
    const templateRow = repeatebleFields.querySelector('.repeateble-row');
    const newRow = templateRow.cloneNode(true);
    const inputFields = newRow.querySelectorAll('.input');
    inputFields.forEach(input => input.value = '');
    repeatebleFields.insertBefore(newRow, addButton);
    newRow.querySelector('.delete-row').addEventListener('click', deleteRow);
}

// Function to handle deleting rows
function deleteRow(event) {
const row = event.target.closest('.repeateble-row');
row.parentNode.removeChild(row);
}

const addNewButtons = document.querySelectorAll('.clone-row');
addNewButtons.forEach(button => button.addEventListener('click', addNewRow));

const deleteButtons = document.querySelectorAll('.delete-row');
deleteButtons.forEach(button => button.addEventListener('click', deleteRow));
  
// ************************************************************
// End of Add and Delete Rows for repeatable fields
// ************************************************************



// ************************************************************
// Add to preview
// ************************************************************



document.addEventListener('DOMContentLoaded', function() {
  function updatePreview() {
    const breakpoints = {};
    document.querySelectorAll('#breakpoints .repeateble-row').forEach(row => {
      const name = row.querySelector('.input-wrap:nth-child(1) .input').value;
      const value = row.querySelector('.input-wrap:nth-child(2) .input').value;
      breakpoints[name] = value + 'px';
    });

    const fontFamily = {};
    document.querySelectorAll('#font-family .repeateble-row').forEach(row => {
      const name = row.querySelector('.input-wrap:nth-child(1) .input').value;
      const value = row.querySelector('.input-wrap:nth-child(2) .input').value.split(',').map(s => `'${s.trim()}'`);
      fontFamily[name] = `[${value.join(", ")}]`;
    });

    const allcolors = {};
    document.querySelectorAll('#colors .color-row').forEach(row => {
      const name = row.querySelector('.color-name').value;
      if (row.querySelector('input.shadesCheckbox').checked == false) {
        const value = row.querySelector('input.colorPicker').value;
        allcolors[name] = value;
      } else {
        const shadows = {};
        row.querySelectorAll('.colorValue').forEach(function callback(value, index) {
          shadows[index] = value.textContent;
        });
        allcolors[name] = shadows;
      }
    });

    const FontSizeCode = document.querySelector("#typography .tailwind-var-preview code").textContent;
    const SpacingCode = document.querySelector("#spacing .tailwind-var-preview code").textContent;

    const theme = {
      screens: breakpoints,
      colors: allcolors,
      fontFamily: fontFamily,
    };

    let themePreview = "theme: {\n";
    themePreview += "  screens: {\n";
    for (let breakpoint in theme.screens) {
      themePreview += `    '${breakpoint}': '${theme.screens[breakpoint]}',\n`;
    }
    themePreview += "  },\n";
    themePreview += "  colors: {\n";
    themePreview += "     transparent: 'transparent',\n";
    themePreview += "     current: 'currentColor',\n"; 
    for (let color in theme.colors) {
        if (typeof theme.colors[color] === "object") {      
            themePreview += `     '${color}': {\n`;
            for (let shades in theme.colors[color]) {
                themePreview += `         ${shades}: '${theme.colors[color][shades]}',\n`;
            }
            themePreview += "     },\n";
        } else {
            themePreview += `     '${color}': '${theme.colors[color]}',\n`;
        }
    }
    themePreview += "  },\n";
    themePreview += FontSizeCode+"\n";
    themePreview += "  fontFamily: {\n";
    for (let font in theme.fontFamily) {
      themePreview += `    '${font}': ${theme.fontFamily[font]},\n`;
    }
    themePreview += "  },\n";
    themePreview += SpacingCode + "\n";
    themePreview += "},\n";

    // Plugins
    const plugins = {};
    document.querySelectorAll('#containerClasses .repeateble-row').forEach(row => {
      const className = row.querySelector('.input-wrap:nth-child(1) .input').value;
      const width = row.querySelector('.input-wrap:nth-child(2) .input').value + '%';
      const maxWidth = row.querySelector('.input-wrap:nth-child(3) .input').value + 'px';
      const center = row.querySelector('.centerContainer').checked;
      plugins[className] = {
        maxWidth: maxWidth,
        width: width,
        marginLeft: center ? 'auto' : undefined,
        marginRight: center ? 'auto' : undefined,
      };
    });
    
    themePreview += "plugins: [\n";
    themePreview += "  function ({ addComponents }) {\n";
    themePreview += "    addComponents({\n";
    for (let plugin in plugins) {
      themePreview += `      '.${plugin}': {\n`;
      for (let prop in plugins[plugin]) {
        themePreview += `        ${prop}: '${plugins[plugin][prop]}',\n`;
      }
      themePreview += "      },\n";
    }
    themePreview += "    })\n";
    themePreview += "  },\n";
    themePreview += "],\n";

    document.querySelector('#preview code').textContent = themePreview;
  }

  document.addEventListener('input', function(event) {
      if (event.target.matches('#breakpoints .repeateble-row .input, #font-family .repeateble-row .input, #containerClasses .repeateble-row .input')) {
      updatePreview();
    }
  });

  document.addEventListener('change', function (event) {
        if (event.target.matches('#colors input, #spacing input, #typography input, #containerClasses input')) {
            setTimeout(updatePreview, 0);
        }
  });

    document.addEventListener('click', function (event) {
      if (event.target.matches('.clone-row, .delete-row, .clone-color-row, .delete-row-color, .addColorPickerButton, .colorPickerWrap button, #spacing button, #typography button, .delFont, #containerClasses button')) {
      setTimeout(updatePreview, 0);
    }
  });

    setTimeout(updatePreview, 0);
});






// ************************************************************
// End of Add to preview
// ************************************************************
