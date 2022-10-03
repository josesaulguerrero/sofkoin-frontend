import Swal from 'sweetalert2';

const getBasicAlert = (msg: string) => ({
  color: '#009bff',
  background: '#090947',
  [msg.length > 30 ? 'text' : 'title']: msg,
  confirmButtonColor: '#6f00d0',
});

export function errorAlert(msg: string) {
  Swal.fire({
    ...getBasicAlert(msg),
    timer: 5000,
    icon: 'error',
  });
}

export function infoAlert(msg: string) {
  Swal.fire({
    ...getBasicAlert(msg),
    timer: 3000,
    icon: 'info',
  });
}

export function successAlert(msg: string) {
  Swal.fire({
    ...getBasicAlert(msg),
    position: 'center',
    icon: 'success',
    timer: 2500,
  });
}

export function confirmAlert({
  msg,
  confMsg,
}: {
  msg: string;
  confMsg: string;
}) {
  return Swal.fire({
    ...getBasicAlert(msg),
    timer: undefined,
    showDenyButton: true,
    showConfirmButton: true,
    confirmButtonText: confMsg,
    denyButtonColor: '#ed3131',
  });
}

export function signUpAlert() {
  Swal.fire({
    icon: 'success',
    title: 'Signed in successfully.',
    position: 'top-end',
    timer: 2000,
    toast: true,
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}
