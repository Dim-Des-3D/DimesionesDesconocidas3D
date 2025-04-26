// Inicializar Swiper.js
const swiper = new Swiper('.swiper-container', {
  loop: true, // Habilitar el bucle infinito
  autoplay: {
    delay: 6000, // Cambiar cada 3 segundos
    disableOnInteraction: false, // Continuar después de la interacción
  },
  navigation: {
    nextEl: '.swiper-button-next', // Botón siguiente
    prevEl: '.swiper-button-prev', // Botón anterior
  },
  slidesPerView: 1, // Mostrar una imagen a la vez
  spaceBetween: 10, // Espaciado entre las imágenes
});