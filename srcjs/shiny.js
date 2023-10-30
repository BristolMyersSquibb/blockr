import { collapse, toggleOutputInput } from "./collapse.js";
import { remove } from "./remove-stack.js";
import { copyCode } from "./copy.js";

Shiny.addCustomMessageHandler("blockr-bind-stack", (msg) => {
  const stack = `#${msg.stack}`;
  setTimeout(() => {
    remove(stack);
    collapse(stack);
    copyCode();
  }, 750);
});

Shiny.addCustomMessageHandler("blockr-add-block", (msg) => {
  const stack = `#${msg.stack}`;
  // TODO remove this
  // be event based/async instead of timeout
  setTimeout(() => {
    copyCode();
    toggleOutputInput(stack);
  }, 500);
});

Shiny.addCustomMessageHandler("validate-block", (msg) => {
  if (msg.state) {
    $(`[data-value="${msg.id}"] .card`)
      .addClass("border");
  } else {
    $(`[data-value="${msg.id}"] .card`)
      .removeClass("border")
      .css("border-color", "#DC3444");
  }
});
