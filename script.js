function saludar() {
  alert("Agregado al carrito");
}

function cambiarCantidad(valor) {
  const input = document.getElementById("cantidad");
  let cantidad = parseInt(input.value);

  cantidad += valor;

  // Evitar que baje de 1
  if (cantidad < 1) cantidad = 1;

  input.value = cantidad;
}
