import hljs from "highlight.js/lib/core";
import r from "highlight.js/lib/languages/r";

hljs.registerLanguage("r", r);

$(() => {
  $(document).on("shiny:value", (e) => {
    if (!e.name.match(/-code$/)) {
      return;
    }

    $(`#${e.name}`).addClass("language-r");
    setTimeout(() => {
      hljs.highlightElement(document.getElementById(e.name));
    }, 250);
  });
});
