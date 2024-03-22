import { description } from "./description";

const createPills = (blocks) => {
  return blocks.map((b) => createPill(b)).join("");
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
  handleClick();
};

const blockColor = (block) => {
  if (block.classes.includes("parser_block")) return "info";

  if (block.classes.includes("data_block")) return "primary";

  if (block.classes.includes("transform_block")) return "secondary";

  return "info";
};

const handleClick = () => {
  $(".add-block").off("click");

  $(".add-block").on("click", (e) => {
    const ns = $(e.target).closest(".blockr-registry").attr("id").split("-");
    ns.pop();

    window.Shiny.setInputValue(
      `${ns.join("-")}-add`,
      parseInt($(e.target).data("index")),
    );

    const id = $(e.target).closest(".offcanvas").offcanvas("hide").attr("id");
    window.bootstrap.Offcanvas.getOrCreateInstance(`#${id}`).hide();
  });
};
