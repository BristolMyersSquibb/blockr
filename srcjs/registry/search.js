import { renderPills } from "./render";
import { bindScroll, unbindScroll } from "./scroll";

export const bindSearch = (params) => {
  handleSearch(params);
};

export const handleSearch = (params) => {
  $(`#${params.ns}-search`).off("click");
  $(`#${params.ns}-query`).off("keyup");

  $(`#${params.ns}-search`).on("click", search(params));
  $(`#${params.ns}-query`).on("keyup", search(params));
};

const search = (params) => {
  return (event) => {
    if (event.key && event.key != "Enter") return;
    const { target } = event;

    const queryNode = $(`#${params.ns}-query`);
    const query = String(queryNode?.val());

    $(target).closest(".blockr-registry").find(".block-list-wrapper").html("");

    if (query == "") {
      fetch(`${params.scroll}&min=1&max=10`)
        .then((res) => res.json())
        .then((data) => {
          renderPills(params, data);
          bindScroll(params);
        });

      return;
    }

    fetch(`${params.search}&query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        renderPills(params, data);
        unbindScroll(params);
      });
  };
};
