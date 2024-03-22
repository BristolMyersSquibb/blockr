import { renderPills } from "./render";

export const unbindScroll = (params) => {
  $(`#${params.ns}-scrollable`).off("scroll");
};

export const bindScroll = (params, endpoints) => {
  fetchUntilScrollable(params, endpoints);

  unbindScroll(params);

  $(`#${params.ns}-scrollable`).on("scroll", (e) => {
    unbindScroll(params);
    endpoints.fetchLeast().then((data) => {
      renderPills(params, data);
      bindScroll(params);
    });
  });
};

async function fetchUntilScrollable(params, endpoints) {
  return endpoints.fetchLeast().then((data) => {
    if (!data.length) return;

    renderPills(params, data);
  });
}
