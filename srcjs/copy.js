export const copyCode = (el) => {
  el.select();
  navigator.clipboard.writeText($(el).text());
};

$(() => {
  $(".block-copy-code").each((_, btn) => {
    // already has a listener
    if (btn.getAttribute("listener") == "true") {
      return;
    }

    $(btn).on("click", (event) => {
      const code = $(event.target).closest("div").find("pre");
      copyCode(code);
    });
  });
});
