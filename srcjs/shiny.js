import {
  collapse,
  toggleOutputInput,
  handleIcons,
  collapseOtherBlocks,
} from "./collapse.js";
import { title } from "./stack-title.js";
import { renderLocked } from "./lock.js";
import { tooltip } from "./tooltips.js";
import { removeStack } from "./remove.js";

window.Shiny.addCustomMessageHandler("blockr-bind-stack", (msg) => {
  const stack = `#${msg.stack}`;
  setTimeout(() => {
    collapse(stack);
    title(stack, msg.stack);
    renderLocked(stack, msg.locked);
    tooltip();
    removeStack(stack);
    const event = new CustomEvent("blockr:stack-render", { detail: msg });
    document.dispatchEvent(event);
  }, 750);
});

window.Shiny.addCustomMessageHandler("blockr-add-block", (msg) => {
  const stack = `#${msg.stack}`;
  $(stack).removeClass("d-none");

  // TODO remove this
  // be event based/async instead of timeout
  setTimeout(() => {
    toggleOutputInput(stack);
    handleIcons(stack);
    collapseOtherBlocks(stack, msg.block);
  }, 500);

  $(document).on("shiny:value", (event) => {
    if (![`${msg.block}-plot`, `${msg.block}-res`].includes(event.name)) return;

    $(`[data-value='${msg.block}-block']`)
      .find(".block-loading")
      .addClass("d-none");
  });
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

const showInputsOnError = (opts) => {
  // input is valid - we skip
  if (opts.state) return;

  // input is invalid
  // we show the parent input block
  // this is because if the error occurs in the
  // last block then the inputs are hidden by default
  $(`#${opts.id}`).closest(".block-inputs").removeClass("d-none");
};

window.Shiny.addCustomMessageHandler("validate-input", (msg) => {
  showInputsOnError(msg);
  changeInputBorder(msg);
});

window.Shiny.addCustomMessageHandler("toggle-submit", (msg) => {
  $(`#${msg.id}`).prop("disabled", !msg.state);
});
