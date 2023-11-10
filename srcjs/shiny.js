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

// Block color feedback (validation)
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

// Input color feedback (validation)
Shiny.addCustomMessageHandler("validate-input", (msg) => {
  // Some inputs are dynamically generated like in filter block.
  // Adding a delay ensure they're in the DOM.
  setTimeout(() => {
    if (msg.state) {
      $(`#${msg.id}`)
        .css("border-color", "#ced4da");
    } else {
      $(`#${msg.id}`)
        .css("border-color", "#DC3444");
    }
  }, 500);
});

Shiny.addCustomMessageHandler("toggle-submit", (msg) => {
  $(`#${msg.id}`).prop('disabled', !msg.state)
});
