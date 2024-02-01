$(() => {
  tooltip();
});

export const tooltip = () => {
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltips].map((el) => new window.bootstrap.Tooltip(el));
};
