/** @type {import('stylelint').Config} */
export default {
  rules: {
    "block-no-empty": [
      true,
      {
        severity: "error",
      },
    ],
    "comment-no-empty": [
      true,
      {
        severity: "warning",
      },
    ],
  },
};
