import { renderPills } from "./render";

export const handleSearch = (params, endpoints) => {
  $(`#${params.ns}-query`).off("keyup");

  $(`#${params.ns}-query`).on("keyup", search(params, endpoints));
};

const search = (params, endpoints) => {
  let debounce;
  return (event) => {
    const query = $(event.target).val();

    $(event.target).closest(".offcanvas").find(".scrollable-child").html("");

    clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (query == "") {
        endpoints.fetchLeast().then((data) => {
          renderPills(params, data);
        });
      }

      endpoints.fetchLeast().then((data) => {
        data = data.filter((block) => {
          return block.name.includes(query);
        });

        if (data.length > 100) window.Shiny.notifications.show();

        renderPills(params, data.slice(0, 100));
      });
    }, 500);
  };
};
