export const remove = (stack) => {
  $(stack).find(".stack-remove").each((_, btn) => {
    // already has a listener
    if (btn.getAttribute("listener") == "true") {
      return;
    }

    $(btn).on("click", (event) => {
      $(event.target).closest(".stack").remove();
    });
  });
};
