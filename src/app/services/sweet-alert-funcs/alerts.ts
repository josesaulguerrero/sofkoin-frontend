import Swal from 'sweetalert2';

const getBasicAlert = (msg: string) => ({
  color: '#009bff',
  background: '#090947',
  [msg.length > 30 ? 'text' : 'title']: msg,
  timer: 1500,
});

export function errorAlert(msg: string) {
  Swal.fire({
    ...getBasicAlert(msg),
    timer: undefined,
    icon: 'error',
  });
}

export function infoAlert(msg: string) {
  Swal.fire({
    ...getBasicAlert(msg),
    timer: undefined,
    icon: 'info',
  });
}

export function successAlert(msg: string) {
  Swal.fire({
    ...getBasicAlert(msg),
    position: 'bottom-left',
    icon: 'success',
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
  });
}
