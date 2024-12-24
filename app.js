const express = require('express');
const app = express();
const path = require('path');

// Middleware para servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para cargar el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
