import { collapse } from "./collapse.js";
import { remove } from "./remove-stack.js";

Shiny.addCustomMessageHandler("blockr-bind-stack", (msg) => {
  const stack = `#${msg.stack}`;
  remove(stack);
  collapse(stack);
});
