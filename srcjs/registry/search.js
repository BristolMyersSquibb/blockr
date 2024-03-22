import { renderPills } from "./render";

export const handleSearch = (params, endpoints) => {
  $(`#${params.ns}-query`).off("keyup");
  $(`#${params.ns}-query`).on("keyup", search(params, endpoints));
};

const search = (params, endpoints) => {
  let debounce;

  return (event) => {
    const query = $(event.target).val();

    clearTimeout(debounce);

    debounce = setTimeout(() => {
      $(event.target)
        .closest(".offcanvas-body")
        .find(".scrollable-child")
        .html("");

      if (query == "") {
        endpoints.fetchLeast().then((data) => {
          renderPills(params, data);
        });
        return;
      }

      endpoints.fetchLeast().then((data) => {
        data = data.filter((block) => {
          return block.name.toLowerCase().includes(query.toLowerCase());
        });

        if (data.length > 100)
          window.Shiny.notifications.show({
            html: "Showing only the first 100 results.",
          });

        renderPills(params, data.slice(0, 100));
      });
    }, 500);
  };
};
