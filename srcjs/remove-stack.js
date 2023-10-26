export const remove = (stack) => {
  $(stack).find(".stack-remove").each((_, btn) => {
    // already has a listener
    if (btn.getAttribute("listener") == "true") {
      return;
    }

    $(btn).on("click", (event) => {
      const $stack = $(event.target).closest(".stack");
      const $masonry = $stack.closest(".masonry-item");

      $stack.remove();

      if ($masonry.length === 0) {
        return;
      }

      $masonry.remove();
    });
  });
};
