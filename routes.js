const express = require('express');
const router = express.Router();

// Rutas a vistas EJS principales
router.get('/', (req, res) => res.render('index', { title: 'Inicio' }));
router.get('/about', (req, res) => res.render('about', { title: 'About Us' }));
router.get('/blog', (req, res) => res.render('blog', { title: 'Blog' }));
router.get('/cart', (req, res) => res.render('cart', { title: 'Cart' }));
router.get('/checkout', (req, res) => res.render('checkout', { title: 'Checkout' }));
router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }));
router.get('/shop', (req, res) => res.render('shop', { title: 'Shop' }));
router.get('/my-account', (req, res) => res.render('my-account', { title: 'My Account' }));
router.get('/single-product', (req, res) => res.render('single-product', { title: 'Single Product' }));
router.get('/order-tracking', (req, res) => res.render('order-tracking', { title: 'Order Tracking' }));

// Ruta: Productos (Consulta desde MySQL)
router.get('/productos', (req, res) => {
    const db = req.app.get('db');
    const query = 'SELECT * FROM productos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los productos:', err);
            return res.status(500).send('Error en el servidor');
        }

        const productos = results.map(producto => ({
            ...producto,
            precio: parseFloat(producto.precio)
        }));

        res.render('productos', { title: 'Productos', productos });
    });
});

// Ruta: Añadir al carrito (POST)
router.post('/cart/add', (req, res) => {
    const db = req.app.get('db');
    const { producto_id } = req.body;

    const query = `
        INSERT INTO carrito (producto_id, cantidad) 
        VALUES (?, 1) 
        ON DUPLICATE KEY UPDATE cantidad = cantidad + 1;
    `;

    db.query(query, [producto_id], (err) => {
        if (err) {
            console.error('Error al añadir al carrito:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.redirect('/productos');
    });
});

// Ruta: Mostrar la wishlist (Actualizada)
router.get('/wishlist', (req, res) => {
    const db = req.app.get('db');
    const usuario_id = 1; // Usuario fijo para este ejemplo

    const query = `
        SELECT p.id, p.nombre, p.precio, p.imagen 
        FROM wishlist w 
        JOIN productos p ON w.producto_id = p.id 
        WHERE w.usuario_id = ?;
    `;

    db.query(query, [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener la wishlist:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.render('wishlist', { title: 'Wishlist', productos: results });
    });
});

// Ruta: Añadir a la wishlist (POST)
router.post('/wishlist/add', (req, res) => {
    const db = req.app.get('db');
    const { producto_id } = req.body;
    const usuario_id = 1;

    const query = `
        INSERT INTO wishlist (usuario_id, producto_id) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE producto_id = producto_id;
    `;

    db.query(query, [usuario_id, producto_id], (err) => {
        if (err) {
            console.error('Error al añadir a la wishlist:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.redirect('/productos');
    });
});

// Ruta: Detalle de un Producto (Consulta desde MySQL)
router.get('/single-product/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            return res.status(500).send('Error en el servidor');
        }
        if (results.length === 0) return res.status(404).send('Producto no encontrado');
        res.render('single-product', { title: 'Detalle del Producto', producto: results[0] });
    });
});

// Rutas adicionales (extras)
router.get('/coming-soon', (req, res) => res.render('extras/coming-soon', { title: 'Coming Soon' }));
router.get('/error-page', (req, res) => res.render('extras/error-page', { title: 'Error Page' }));
router.get('/faqs', (req, res) => res.render('extras/faqs', { title: 'FAQs' }));
router.get('/single-post', (req, res) => res.render('extras/single-post', { title: 'Single Post' }));
router.get('/single', (req, res) => res.render('extras/single', { title: 'Single' }));
router.get('/styles', (req, res) => res.render('extras/styles', { title: 'Styles' }));

// Rutas para partials
router.get('/svg', (req, res) => res.render('partials/svg'));
router.get('/navbar', (req, res) => res.render('partials/navbar'));
router.get('/footer', (req, res) => res.render('partials/footer'));

module.exports = router;
