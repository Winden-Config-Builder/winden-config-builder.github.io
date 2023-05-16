const { extractClassNames } = require('tailwindcss-classnames');

const fs = require('fs');

const outputFilename = 'tailwind-classes.json';

// Provide the path to your tailwind.config.js file
const tailwindConfigPath = './tailwind.config.js';

// Extract classes using tailwindcss-classnames utility
const { extractClassNames } = require('tailwindcss-classnames');


// Convert classes to JSON string
const jsonOutput = JSON.stringify(classNames, null, 2);

// Write the JSON string to the output file
fs.writeFileSync(outputFilename, jsonOutput);

console.log(`Tailwind CSS classes extracted and saved to ${outputFilename}`);
