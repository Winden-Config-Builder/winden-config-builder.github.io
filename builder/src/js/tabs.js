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