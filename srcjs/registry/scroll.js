import { renderPills } from "./render";

export const unbindScroll = (params) => {
  $(`#${params.ns}-scrollable`).off("scroll");
};

export const bindScroll = (params) => {
  fetchUntilScrollable(params);

  unbindScroll(params);

  $(`#${params.ns}-scrollable`).on("scroll", (e) => {
    const childHeight = $(`#${params.ns}-scrollable-child`).height();
    const scrollableHeight = $(`#${params.ns}-scrollable`).height();
    const scrollTop = $(e.target).scrollTop();

    if (childHeight - scrollableHeight - scrollTop > 10) {
      return;
    }

    unbindScroll(params);
    fetchMore(params).then(() => bindScroll(params));
  });
};

async function fetchMore(params) {
  const n = getNBlocks(params.ns);

  return fetch(`${params.scroll}&min=${n + 1}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return;

      renderPills(params, data);
    });
}

async function fetchUntilScrollable(params) {
  const n = getNBlocks(params.ns);

  return fetch(`${params.scroll}&min=${n + 1}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return;

      renderPills(params, data);

      if (
        $(`#${params.ns}-scrollable-child`).height() <=
        $(`#${params.ns}-scrollable`).height()
      ) {
        fetchUntilScrollable(params);
      }
    });
}

const getNBlocks = (ns) => {
  return $(`#${ns}-scrollable`).find(".add-block").length;
};
