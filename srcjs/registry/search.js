import { renderPills } from "./render";
import { bindScroll, unbindScroll } from "./scroll";

export const bindSearch = (params) => {
  handleSearch(params);
};

export const handleSearch = (params) => {
  $(`#${params.ns}-query`).off("keyup");

  $(`#${params.ns}-query`).on("keyup", search(params));
};

const search = (params) => {
  let debounce;
  return () => {
    const queryNode = $(`#${params.ns}-query`);
    const query = String(queryNode?.val());

    $(`#${params.ns}-scrollable-child`).html("");

    clearTimeout(debounce);
    debounce = setTimeout(() => {
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
    }, 500);
  };
};
