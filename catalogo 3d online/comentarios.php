CREATE DATABASE catalogo3d;

USE catalogo3d;

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    valoracion INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);