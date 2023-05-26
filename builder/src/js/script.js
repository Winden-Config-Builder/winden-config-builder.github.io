// ************************************************************
// Tabs
// ************************************************************


// Get the first tab button and simulate a click on page load
 window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('breakpointsTab').click();
  });

  function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and add the "hidden" class
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.add("hidden");
    }

    // Get all elements with class="tablinks" and remove the class "bg-white"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("bg-white");
    }

    // Show the current tab, and add the "bg-white" class to the button that opened the tab
    document.getElementById(tabName).classList.remove("hidden");
    evt.currentTarget.classList.add("bg-white");
  }

// ************************************************************
// End of Tabs
// ************************************************************


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
