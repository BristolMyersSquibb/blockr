$(() => {
  $(document).on("shiny:inputchanged", function (event) {
    if (event.binding === null) return;

    const block = $(event.el).closest(".block");
    if (block.length === 0) return;

    const ns = $(block).data("value").replace("-block", "");

    window.Shiny.setInputValue(`${ns}-lastinput`, {
      name: event.name.replace(`${ns}-`, ""),
      value: event.value,
    });
  });
});
