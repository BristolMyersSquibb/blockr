export const removeStack = (stack) => {
  $(stack)
    .find(".stack-remove")
    .on("click", () => {
      $(stack)
        .find("[data-bs-toggle='tooltip']")
        .each((_index, el) => {
          window.bootstrap.Tooltip.getOrCreateInstance(el).dispose();
        });

      const event = new CustomEvent("blockr:remove-stack", {
        detail: {
          stack: stack.replace("#", ""),
        },
      });
      document.dispatchEvent(event);
    });
};
