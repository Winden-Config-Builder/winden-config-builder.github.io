// Access iframe after it loads
const myFrame = document.getElementById('myFrame');
myFrame.onload = function() {
  const frameWindow = myFrame.contentWindow;
  const frameDoc = frameWindow.document;
  let selectedElement = null;

  // Highlight element on hover
  frameDoc.addEventListener('mouseover', (event) => {
    if (!selectedElement) {
      event.target.classList.add('highlight');
    }
  });

  frameDoc.addEventListener('mouseout', (event) => {
    if (!selectedElement) {
      event.target.classList.remove('highlight');
    }
  });

  // Select element on click
  frameDoc.addEventListener('click', (event) => {
    if (selectedElement) {
      selectedElement.classList.remove('selected');
    }
    selectedElement = event.target;
    selectedElement.classList.add('selected');
  });

  // Assign classes based on button click
  const buttons = document.querySelectorAll('.btn');
  const tailwindButtons = document.querySelectorAll('.btn-group-tailwind .btn');

  const handleButtonClick = (button) => {
    if (selectedElement) {
      const className = button.dataset.classname; // Get class name from data attribute
      selectedElement.classList.toggle(className); // Toggle the class
    }

    // Remove active class from all buttons
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    tailwindButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');
  };

  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      handleButtonClick(button);
    });
  });

  tailwindButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      // Find the closest .btn-group-tailwind ancestor of the clicked button
      const btnGroup = button.closest('.btn-group-tailwind');
      if (btnGroup) {
        const nestedButtons = btnGroup.querySelectorAll('.btn');
        nestedButtons.forEach(nestedButton => {
          if (nestedButton !== button) {
            const className = nestedButton.dataset.classname; // Get class name from data attribute
            if (className) {
              selectedElement.classList.remove(className); // Remove the class from the selected element
            }
          }
        });
      }

      handleButtonClick(button);
    });
  });
};
