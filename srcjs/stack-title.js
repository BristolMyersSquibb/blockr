export const title = (stack, ns) => {
  const $title = $(stack).find(".stack-title");

  $title.on("click", () => {
    $title.replaceWith(
      `<input type="text" class="stack-title-input form-control form-control-sm mx-1" value="${$title.text()}">`,
    );
    handleStackTitle(stack, ns);
  });
};

const handleStackTitle = (stack, ns) => {
  $(stack).find(".stack-title-input").off("keydown");

  $(stack)
    .find(".stack-title-input")
    .on("keydown", (e) => {
      if (e.key !== "Enter") return;

      const newTitle = $(e.target).val();

      $(e.target).replaceWith(
        `<span class="stack-title cursor-pointer">${newTitle}</span>`,
      );

      title(stack);
      window.Shiny.setInputValue(`${ns}-newTitle`, newTitle);
    });
};
