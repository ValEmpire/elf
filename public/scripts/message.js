const showError = (message) => {
  Toastify({
    text: decodeURIComponent(message), // remove %20 in white space
    backgroundColor: "linear-gradient(to right, #FFC105, #DC3545)",
    className: "info",
    gravity: "bottom",
  }).showToast();
};

const showSuccess = (message) => {
  Toastify({
    text: decodeURIComponent(success), // remove %20 in white space
    backgroundColor: "#28A745",
    className: "info",
    gravity: "bottom",
  }).showToast();
};
