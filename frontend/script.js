const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const userListTitle = document.getElementById('userListTitle');

// Crear usuario
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const edad = document.getElementById('edad').value;

    // Validación de datos
    if (!nombre || !correo || !edad) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(correo)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    const user = { nombre, correo, edad };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert('Usuario creado correctamente');
            loadUsers();
            setTimeout(() => {
            document.getElementById('nombre').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('edad').value = '';
            userForm.reset();
        }, 50);
        } else {
            throw new Error('Error al crear el usuario');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Cargar usuarios
async function loadUsers() {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    userList.innerHTML = users.map(user => `
        <li>
            ${user.nombre} - ${user.correo} - ${user.edad}
            <button class="delete-btn" onclick="deleteUser('${user._id}')">Eliminar</button>
        </li>
    `).join('');
}

// Eliminar usuario
async function deleteUser(userId) {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        alert('Usuario eliminado');
        loadUsers(); // Recargar la lista después de eliminar
    setTimeout(() => {
        userForm.reset();
    }, 50);
    } else {
        alert('Error al eliminar el usuario');
    }
}

// Alternar la visibilidad de la lista y la activación de la etiqueta
userListTitle.addEventListener('click', () => {
    userList.classList.toggle('show');
    userListTitle.classList.toggle('active');
});

loadUsers();
