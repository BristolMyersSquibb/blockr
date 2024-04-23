export const loading = (stack) => {
  $(document).on("shiny:outputinvalidated", (event) => {
    if (!event.name.match(`^${stack}`)) return;
    if (!event.name.match("res$|plot$")) return;

    $(`#${event.name}`).addClass("d-none");
    $(`#${event.name}`)
      .closest(".block")
      .find(".block-loading")
      .removeClass("d-none");
  });

  $(document).on("shiny:value shiny:error", (event) => {
    if (!event.name.match(`^${stack}`)) return;
    if (!event.name.match("res$|plot$")) return;

    $(`#${event.name}`).removeClass("d-none");
    $(`#${event.name}`)
      .closest(".block")
      .find(".block-loading")
      .addClass("d-none");
  });
};
