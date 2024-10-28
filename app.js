const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Verificar la conexión
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Salir si hay un error de conexión
  }
  console.log('Conectado a la base de datos MySQL');
});

// Exportar la conexión
app.set('db', db); // Guardar la conexión en `app` para que las rutas puedan acceder a ella

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const routes = require('./routes'); // Importar las rutas
app.use('/', routes); // Usar las rutas

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});