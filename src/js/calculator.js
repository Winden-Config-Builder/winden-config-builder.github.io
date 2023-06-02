function updateValues(id) {
    const tab = document.querySelector("#" + id);
    return {
        minScreenWidth: parseFloat(tab.querySelector(".minScreenWidth").value),
        maxScreenWidth: parseFloat(tab.querySelector(".maxScreenWidth").value),
        minBaseFontSize: parseFloat(
            tab.querySelector(".minBaseFontSize").value
        ),
        maxBaseFontSize: parseFloat(
            tab.querySelector(".maxBaseFontSize").value
        ),
        minScaleRatio: parseFloat(tab.querySelector(".minScaleRatio").value),
        typeScaleNames: tab.querySelector(".typeScaleNames").value.split(","),
        maxScaleRatio: parseFloat(tab.querySelector(".maxScaleRatio").value),
        decimalPlaces: parseInt(tab.querySelector(".rounding").value),
    };
}

function generate() {
    let tabIds = [
        "spacing",
        "typography",
    ];
    let WrappedCSSAll = '';
    tabIds.forEach((id) => {
        let tabs = document.querySelectorAll("#" + id);
        for (tab of tabs) {
            let values = updateValues(id);
            let cssVariables = "";
            if (id === 'spacing') {
                var tailwindVarPreview = "  spacing: {\n";
                var tailwindPreview = " spacing: {\n";
            } else {
                var tailwindVarPreview = "  fontSize: {\n";
                var tailwindPreview = " fontSize: {\n";
            }
            let select = tab.querySelector(".baseLineSelect");
            let index = select.selectedIndex;
            let fontBlock = tab.querySelector(".font-preview");
            fontBlock.innerHTML = "";

            // if disableRatio selected
            if (tab.querySelector(".disableRatio").checked) {
                var sizes = tab.querySelectorAll(".typographySingleWrap .input-group");
                for (let i = 0; i < sizes.length; i++) {
                    let minFontSize = Number(sizes[i].querySelector(".minScaleRatio").value);
                    let maxFontSize = Number(sizes[i].querySelector(".maxScaleRatio").value);
                    let vwValue =
                        ((maxFontSize - minFontSize) * 100) /
                        (values.maxScreenWidth - values.minScreenWidth);
                    let pxValue = minFontSize - (values.minScreenWidth * vwValue) / 100;

                    let typeScaleName = sizes[i].querySelector(".maxScaleName").value
                        ? sizes[i].querySelector(".maxScaleName").value
                        : i;
                    

                    if (id === 'spacing') {
                        var cssVariable = `--win-sp-${typeScaleName}`;
                        // custom lorem ipsum
                        var p = document.createElement("div");
                        p.classList.add(typeScaleName);
                        p.classList.add("bg-slate-300");
                        p.style.width = "var(--win-sp-" + typeScaleName + ")";
                        p.style.height = "var(--win-sp-" + typeScaleName + ")";
                        fontBlock.append(p);
                    } else {
                        var cssVariable = `--win-fs-${typeScaleName}`;
                        // custom lorem ipsum
                        var p = document.createElement("p");
                        p.innerHTML = "Lorem ipsum";
                        p.classList.add(typeScaleName);
                        p.style.fontSize = "var(--win-fs-" + typeScaleName + ")";
                        fontBlock.append(p);
                    }

                    cssVariables += `   ${cssVariable}: clamp(${minFontSize.toFixed(
                        values.decimalPlaces
                    )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
                        values.decimalPlaces
                    )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

                    // Add entries to tailwind var preview
                    tailwindVarPreview += `     ${typeScaleName}: 'var(${cssVariable})',\n`;

                    // Add entries to tailwind preview
                    tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(
                        values.decimalPlaces
                    )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
                        values.decimalPlaces
                    )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
                }
            } else {
                for (let i = 0; i < values.typeScaleNames.length; i++) {
                    if (index > 0) {
                        var base = i - index;
                    } else {
                        var base = i;
                    }
                    let minFontSize =
                        values.minBaseFontSize * Math.pow(values.minScaleRatio, base);
                    let maxFontSize =
                        values.maxBaseFontSize * Math.pow(values.maxScaleRatio, base);

                    let vwValue =
                        ((maxFontSize - minFontSize) * 100) /
                        (values.maxScreenWidth - values.minScreenWidth);
                    let pxValue = minFontSize - (values.minScreenWidth * vwValue) / 100;

                    let typeScaleName = values.typeScaleNames[i].trim();
                    if (id === 'spacing') {
                        var cssVariable = `--win-sp-${typeScaleName}`;
                        // custom lorem ipsum
                        var p = document.createElement("div");
                        p.classList.add(typeScaleName);
                        p.classList.add("bg-slate-300");
                        p.style.width = "var(--win-sp-" + typeScaleName + ")";
                        p.style.height = "var(--win-sp-" + typeScaleName + ")";
                        fontBlock.append(p);
                    } else {
                        var cssVariable = `--win-fs-${typeScaleName}`;
                        // custom lorem ipsum
                        var p = document.createElement("p");
                        p.innerHTML = "Lorem ipsum";
                        p.classList.add(typeScaleName);
                        p.style.fontSize = "var(--win-fs-" + typeScaleName + ")";
                        fontBlock.append(p);
                    }

                    

                    cssVariables += `   ${cssVariable}: clamp(${minFontSize.toFixed(
                        values.decimalPlaces
                    )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
                        values.decimalPlaces
                    )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

                    // Add entries to tailwind var preview
                    tailwindVarPreview += `     ${typeScaleName}: 'var(${cssVariable})',\n`;

                    // Add entries to tailwind preview
                    tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(
                        values.decimalPlaces
                    )}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(
                        values.decimalPlaces
                    )}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
                }
            }

            const wrappedCSSVariables = `:root {\n${cssVariables}}\n`;

            const styleTag = document.getElementById("generated-styles-" + id);
            if (styleTag) {
                styleTag.textContent = wrappedCSSVariables;
            } else {
                const head = document.head || document.getElementsByTagName("head")[0];
                const newStyleTag = document.createElement("style");
                newStyleTag.setAttribute("id", "generated-styles-" + id);
                newStyleTag.textContent = wrappedCSSVariables;
                head.appendChild(newStyleTag);
            }

            tab.querySelector(
                ".tailwind-var-preview code"
            ).textContent = `${tailwindVarPreview}  }`;
            tab.querySelector(
                ".tailwind-preview code"
            ).textContent = `${tailwindPreview} }`;
            WrappedCSSAll += cssVariables;
            if (id === 'spacing') {
                WrappedCSSAll += "\n";
            }
        }
    });
    document.querySelector(".css-variables-preview code").textContent = `:root {\n${WrappedCSSAll}}\n`;
}

function updateSelectOptions() {
    let tabIds = [
        "spacing",
        "typography",
    ];
    tabIds.forEach((id) => {
        let tabs = document.querySelectorAll("#" + id);
        for (tab of tabs) {
            let typeScaleNames = tab
                .querySelector(".typeScaleNames")
                .value.split(/\s*,\s*/);
            let select = tab.querySelector(".baseLineSelect");

            // clear out old options
            while (select.firstChild) {
                select.firstChild.remove();
            }

            // create and append new options
            for (let i = 0; i < typeScaleNames.length; i++) {
                let option = document.createElement("option");
                option.value = typeScaleNames[i];
                option.text = typeScaleNames[i];
                select.appendChild(option);
            }
        }
        });
}


let inputClasses = [
    "minBaseFontSize",
    "minScreenWidth",
    "minScaleRatio",
    "maxBaseFontSize",
    "maxScreenWidth",
    "maxScaleRatio",
    "typeScaleNames",
    "rounding",
    "baseLineSelect",
];

inputClasses.forEach((className) => {
    let elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("input", () => {
            if (className === "typeScaleNames") {
                updateSelectOptions();
            }
            generate();
        });
    }
});

let inputs = document.querySelectorAll(".input");
inputs.forEach((input) => {
    input.addEventListener("input", () => {
        generate();
    });
});

// Generate CSS variables and update select options on page load
window.addEventListener("load", function () {
    updateSelectOptions();
    generate();
});

const disableRatio = document.getElementsByClassName("disableRatio")
for (var i = 0; i < disableRatio.length; i++) {
    disableRatio[i].addEventListener("click", () => disableRatioFunction(event));
}
function disableRatioFunction(event) {
    const tab = event.target.closest(".tabcontent");
    let typographyRatio = tab.getElementsByClassName("typographyRatio")[0];
    let typographySingle = tab.getElementsByClassName("typographySingle")[0];

    if (event.target.checked) {
        typographyRatio.style.display = "none";
        typographySingle.style.display = "block";
    } else {
        typographyRatio.style.display = "block";
        typographySingle.style.display = "none";
    }
    generate();
}


const AddFont = document.getElementsByClassName("AddFont")
for (var i = 0; i < AddFont.length; i++) {
    AddFont[i].addEventListener("click", () => AddFontCunstom(event));
}

function AddFontCunstom(event) {
    const tab = event.target.closest(".tabcontent");
    let typographySingleWrap = tab.querySelector(
        ".typographySingle .typographySingleWrap"
    );
    let inputGroup = tab.querySelector(".typographySingle .input-group");
    let clonedInputGroup = inputGroup.cloneNode(true); // This creates a copy of the inputGroup

    // Make sure to add an event listener to the cloned "delFont" button
    let delFontButton = clonedInputGroup.querySelector(".delFont");
    delFontButton.addEventListener("click", function () {
        this.closest(".input-group").remove();
        generate();
    });

    typographySingleWrap.appendChild(clonedInputGroup); // This adds the copy to the DOM
    generate();
}


// Event listener for initial "delFont" button
let delFontButtons = document.querySelectorAll(".delFont");
delFontButtons.forEach((button) => {
    button.addEventListener("click", function () {
        this.closest(".input-group").remove();
    });
});
