import { description } from "./description";
import { handleSearch } from "./search";

const createPills = (blocks) => {
  return blocks.map((b) => createPill(b)).join("");
};

const createPill = (block) => {
  return `<p class="cursor-pointer mb-1 badge add-block bg-${blockColor(
    block,
  )} me-1"
    data-icon='${block.icon}'
    data-index="${block.index}"
    data-name="${block.name}"
    data-description="${block.description}"
    draggable="true">
    ${block.name}
  </p>`;
};

export const renderPills = (params, data) => {
  const pills = createPills(data);
  $(`#${params.ns}-scrollable-child`).append(pills);
  description();
  handleSearch(params);
  handleClick();
};

const blockColor = (block) => {
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
