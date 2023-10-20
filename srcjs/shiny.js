import { collapse, showLastOutput } from "./collapse.js";
import { remove } from "./remove-stack.js";

Shiny.addCustomMessageHandler("blockr-bind-stack", (msg) => {
  const stack = `#${msg.stack}`;
  setTimeout(() => {
    remove(stack);
    collapse(stack);
  }, 750);
});

Shiny.addCustomMessageHandler("blockr-add-block", (msg) => {
  const stack = `#${msg.stack}`;
  showLastOutput(stack);
});
