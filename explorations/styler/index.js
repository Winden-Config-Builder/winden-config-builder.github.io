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
  
      // Update selectedElement when a tailwind button is clicked
      selectedElement = frameDoc.querySelector('.selected');
    });
  });

  // Function to convert JSON data to HTML structure
  function convertJsonToHtml(data) {
    const html = document.createElement("div");

    for (const item of data) {
      const btnGroup = document.createElement("div");
      btnGroup.classList.add("btn-group-tailwind");

      const title = document.createElement("h3");
      title.textContent = item.title;
      btnGroup.appendChild(title);

      for (const contentItem of item.content) {
        const contentDiv = document.createElement("div");

        const contentTitle = document.createElement("h4");
        contentTitle.textContent = contentItem.title;
        contentDiv.appendChild(contentTitle);

        const contentDocs = document.createElement("a");
        contentDocs.href = contentItem.docs;
        contentDocs.textContent = "Documentation";
        contentDiv.appendChild(contentDocs);

        const contentDescription = document.createElement("p");
        contentDescription.textContent = contentItem.description;
        contentDiv.appendChild(contentDescription);

        const tailGroup = document.createElement("div");
        tailGroup.classList.add("tail-group");
        for (const row of contentItem.table) {
          const button = document.createElement("button");
          const span = document.createElement("span");

          button.classList.add("btn");
          button.dataset.classname = row[0];
          button.textContent = row[0];

          span.textContent = row[1];
          button.appendChild(span);
          tailGroup.appendChild(button);
        }

        contentDiv.appendChild(tailGroup);
        btnGroup.appendChild(contentDiv);
      }

      html.appendChild(btnGroup);
    }

    return html;
  }

  // Function to load JSON data and convert it to HTML structure
  async function loadJsonAndConvertToHtml() {
    try {
      const response = await fetch("tailwind.json");
      const data = await response.json();
      const container = document.getElementById("container");
      const htmlStructure = convertJsonToHtml(data);
      container.appendChild(htmlStructure);

      // Assign classes based on button click
      const buttons = container.querySelectorAll(".btn");

      buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const selectedElement = document.querySelector(".selected");
          if (selectedElement) {
            const className = button.dataset.classname;
            selectedElement.classList.toggle(className);
          }
          buttons.forEach((btn) => {
            btn.classList.remove("active");
          });
          button.classList.add("active");
        });
      });
    } catch (error) {
      console.error("Error loading JSON file:", error);
    }
  }

  // Call the function to load JSON and convert to HTML
  loadJsonAndConvertToHtml();
};

