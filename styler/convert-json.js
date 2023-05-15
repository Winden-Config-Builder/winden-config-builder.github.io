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

loadJsonAndConvertToHtml();
