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
  // Function to update theme preview
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

    const theme = {
      screens: breakpoints,
      fontFamily: fontFamily,
    };

    let themePreview = "theme: {\n";
    themePreview += "  screens: {\n";
    for (let breakpoint in theme.screens) {
      themePreview += `    '${breakpoint}': '${theme.screens[breakpoint]}',\n`;
    }
    themePreview += "  },\n";
    themePreview += "  fontFamily: {\n";
    for (let font in theme.fontFamily) {
      themePreview += `    '${font}': ${theme.fontFamily[font]},\n`;
    }
    themePreview += "  },\n";
    themePreview += "}";

    document.querySelector('#preview code').textContent = themePreview;
  }

  // Event listener for input changes in real-time
  document.addEventListener('input', function(event) {
    if (event.target.matches('#breakpoints .repeateble-row .input, #font-family .repeateble-row .input')) {
      updatePreview();
    }
  });

  // Event listener for adding and deleting rows
  document.addEventListener('click', function(event) {
    if (event.target.matches('.clone-row, .delete-row')) {
      // Add some delay to make sure the new row is added/deleted from the DOM before updating preview
      setTimeout(updatePreview, 0);
    }
  });

  // Initial preview update
  updatePreview();
});





// ************************************************************
// End of Add to preview
// ************************************************************