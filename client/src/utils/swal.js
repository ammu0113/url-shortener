import Swal from "sweetalert2";

export const showConfirmDialog = ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  icon = "warning",
  confirmButtonText = "Yes",
  cancelButtonText = "No",
  customClass = {},
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
    customClass: {
      container: "swal-container",
      popup: "swal-popup",
      ...customClass,
    },
  });
};

export const showSuccessAlert = ({
  title = "Success!",
  text = "Operation completed successfully.",
  timer = 2000,
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showErrorAlert = ({
  title = "Error!",
  text = "Something went wrong.",
  timer = 3000,
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    timer,
    timerProgressBar: true,
    showConfirmButton: true,
  });
};
