const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
const userSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    edad: Number,
});
const { body, validationResult } = require('express-validator');

// Crear un modelo
const User = mongoose.model('User', userSchema);
// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://mongodb:27017/mi-base-de-datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Aumenta el tiempo de espera a 5 segundos
})

.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Hola desde el backend!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Crear un usuario
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send(user);
});

// Leer todos los usuarios
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Leer un usuario por ID
app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
});

// Actualizar un usuario
app.put('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(user);
});

// Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
});

app.post('/users', [
    body('nombre').notEmpty(),
    body('correo').isEmail(),
    body('edad').isInt({ min: 1 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new User(req.body);
    await user.save();
    res.send(user);
});