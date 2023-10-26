const copy = (el) => {
  navigator.clipboard.writeText($(el).text());
};

export const copyCode = () => {
  $(".block-copy-code").each((_index, btn) => {
    // TODO bind selectively instead of reset
    $(btn).off("click");

    $(btn).on("click", (event) => {
      const code = $(event.target).closest("div").find("pre");
      copy(code);
    });
  });
};
