$(() => {
  removeStack();
});

const removeStack = () => {
  $("body").on("click", ".stack-remove", () => {
    $(event.target)
      .closest(".stack")
      .find("[data-bs-toggle='tooltip']")
      .each((_index, el) => {
        window.bootstrap.Tooltip.getOrCreateInstance(el).dispose();
      });

    const event = new CustomEvent("blockr:remove-stack", {
      detail: {
        stack: $(event.target).closest(".stack").attr("id"),
      },
    });
    document.dispatchEvent(event);
  });
};
