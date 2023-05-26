export async function includeHTML() {
  const elements = document.querySelectorAll('[dp-include-html]');
  
  let promises = Array.from(elements).map(async elmnt => {
    let file = elmnt.getAttribute('dp-include-html');
    
    if (file) {
      try {
        let response = await fetch(file);
        if (!response.ok) throw new Error("404");
        let text = await response.text();
        elmnt.innerHTML = text;
      } catch (e) {
        elmnt.innerHTML = "Page not found.";
      } finally {
        elmnt.removeAttribute('dp-include-html');
      }
    }
  });
  
  await Promise.all(promises);
}
