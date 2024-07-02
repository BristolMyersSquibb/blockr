import { collapseOtherBlocks, showLastOutput } from "./collapse.js";
import "./stack-title.js";
import { renderLocked } from "./lock.js";
import { loading } from "./loading.js";

window.Shiny.addCustomMessageHandler("blockr-render-stack", (msg) => {
  const stack = `#${msg.stack}`;
  showLastOutput(stack);
  renderLocked(stack, msg.locked);
  loading(msg.stack);
  const event = new CustomEvent("blockr:stack-render", { detail: msg });
  document.dispatchEvent(event);
});

window.Shiny.addCustomMessageHandler("blockr-add-block", (msg) => {
  const stack = `#${msg.stack}`;
  $(stack).removeClass("d-none");

  setTimeout(() => {
    collapseOtherBlocks(stack, msg.block);
  }, 350);
});

// Block color feedback (validation)
window.Shiny.addCustomMessageHandler("validate-block", (_msg) => {});

window.Shiny.addCustomMessageHandler("validate-input", (_msg) => {});

window.Shiny.addCustomMessageHandler("toggle-submit", (msg) => {
  $(`#${msg.id}`).prop("disabled", !msg.state);
});
