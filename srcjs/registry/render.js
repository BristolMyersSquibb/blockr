import { description } from "./description";
import { capitalise } from "../utils";

const createPills = (blocks) => {
  let pills = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const previous_block = blocks[i - 1];

    if (!previous_block) {
      pills += `<h3>${capitalise(blockType(block))}</h3>`;
    }

    if (previous_block && blockType(block) !== blockType(previous_block)) {
      pills += `<h3 class='mt-3'>${capitalise(blockType(block))}</h3>`;
    }

    pills += createPill(block);
  }
  return pills;
};

const createPill = (block) => {
  const name = block.name.replace("block$", "");
  return `<p class="cursor-pointer mb-1 badge add-block bg-${blockColor(
    block,
  )} me-1"
    data-icon='${block.icon}'
    data-index="${block.index}"
    data-name="${block.name}"
    data-description="${block.description}"
    draggable="true">
    ${name.replace("block$", "")}
  </p>`;
};

export const renderPills = (params, data) => {
  if (data.length === 0) {
    $(`#${params.ns}-scrollable-child`).html(
      "<p class='text-muted'>No blocks found</p>",
    );
    return;
  }

  const pills = createPills(data);
  $(`#${params.ns}-scrollable-child`).append(pills);
  description();
};

const blockType = (block) => {
  if (block.classes.includes("parser_block")) return "parser";
  if (block.classes.includes("data_block")) return "data";
  if (block.classes.includes("transform_block")) return "transform";

  return "visualise";
};

const blockColor = (block) => {
  const type = blockType(block);

  if (type == "parser") return "info";
  if (type == "data") return "primary";
  if (type == "transform") return "secondary";

  return "info";
};

export const handleClick = () => {
  $("body").on("click", ".add-block", (e) => {
    const ns = $(e.target).closest(".blockr-registry").attr("id").split("-");
    ns.pop();

    window.Shiny.setInputValue(
      `${ns.join("-")}-add`,
      parseInt($(e.target).data("index")),
      { priority: "event" },
    );

    const id = $(e.target).closest(".offcanvas").offcanvas("hide").attr("id");
    window.bootstrap.Offcanvas.getOrCreateInstance(`#${id}`).hide();
  });
};
