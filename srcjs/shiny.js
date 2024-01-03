import { collapse, toggleOutputInput } from "./collapse.js";
import { remove } from "./remove-stack.js";

window.Shiny.addCustomMessageHandler("blockr-bind-stack", (msg) => {
  const stack = `#${msg.stack}`;
  setTimeout(() => {
    remove(stack);
    collapse(stack);
  }, 750);
});

window.Shiny.addCustomMessageHandler("blockr-add-block", (msg) => {
  const stack = `#${msg.stack}`;
  // TODO remove this
  // be event based/async instead of timeout
  setTimeout(() => {
    toggleOutputInput(stack);
  }, 500);
});

// Block color feedback (validation)
window.Shiny.addCustomMessageHandler("validate-block", (msg) => {
  if (msg.state) {
    $(`[data-value="${msg.id}"] .card`).removeClass("border-danger");
    return;
  }

  $(`[data-value="${msg.id}"] .card`).addClass("border-danger");
});

// Input color feedback (validation)
const changeInputBorder = (args) => {
  let sel;
  if ($(`#${args.id}`).hasClass("shiny-input-select")) {
    // border is on parent div
    sel = $(`#${args.id}-selectized`).parent(".selectize-input").closest("div");
  } else {
    sel = `#${args.id}`;
  }

  // Some inputs are dynamically generated like in filter block.
  // Adding a delay ensure they're in the DOM.
  setTimeout(() => {
    if (!args.state) {
      $(sel).addClass("is-invalid");
      return;
    }

    $(sel).addClass("is-valid");
  }, 500);
};

window.Shiny.addCustomMessageHandler("validate-input", (msg) => {
  changeInputBorder(msg);
});

window.Shiny.addCustomMessageHandler("toggle-submit", (msg) => {
  $(`#${msg.id}`).prop("disabled", !msg.state);
});
