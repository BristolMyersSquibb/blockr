export const removeStack = (stack) => {
  $(stack)
    .find(".stack-remove")
    .on("click", () => {
      $(stack)
        .find("[data-bs-toggle='tooltip']")
        .each((_index, el) => {
          window.bootstrap.Tooltip.getOrCreateInstance(el).dispose();
        });
    });
};
