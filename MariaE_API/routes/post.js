const express = require('express');
const router = express.Router();
const sequelize = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo db.js

// Ruta para crear cliente
router.post('/create', async (req, res) => {
  const { fullName, doc_type, doc_num, email, phone, address, password } = req.body; // Extrae datos del cuerpo de la solicitud

  try {
    await sequelize.query(
      `INSERT INTO clientes (id_tipo_documento, nombre_cliente, dirección_cliente, celular_cliente, password_cliente, num_doc_cliente, email_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [doc_type, fullName, address, phone, password, doc_num, email]
      }
    );
    res.status(201).json({ success: true, message: 'Registro exitoso' }); // Envía una respuesta de éxito
  } catch (error) {
    console.error(error); // Registra cualquier error en la consola
    res.status(500).json({ success: false, message: 'Error en el registro', error: error.message }); // Envía una respuesta de error
  }
});

router.post('/contactos', async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body || {};
  const values = [nombre, email, telefono, mensaje];

  if (values.some(value => typeof value !== 'string' || value.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios'
    });
  }

  const [cleanNombre, cleanEmail, cleanTelefono, cleanMensaje] = values.map(value => value.trim());

  if (cleanNombre.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'El nombre no puede superar los 100 caracteres'
    });
  }

  if (cleanEmail.length > 150 || !/^[^\s@]+@[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Verifica que el correo electrónico sea válido y no supere los 150 caracteres'
    });
  }

  if (cleanTelefono.length > 20) {
    return res.status(400).json({
      success: false,
      message: 'El teléfono no puede superar los 20 caracteres'
    });
  }

  try {
    await sequelize.query(
      'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
      { replacements: [cleanNombre, cleanEmail, cleanTelefono, cleanMensaje] }
    );
    res.status(201).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al guardar el mensaje de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.'
    });
  }
});


// Función para crear una entrada en cualquier tabla
async function createEntry(table, columns, values) {
  const columnsStr = columns.join(', ');
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT INTO ${table} (${columnsStr}) VALUES (${placeholders})`;
  const result = await sequelize.query(sql, { replacements: values });
  return result;
}

// Función para obtener todas las entradas de cualquier tabla
async function getEntries(table) {
  const sql = `SELECT * FROM ${table}`;
  const [rows] = await sequelize.query(sql);
  return rows;
}

// Función para obtener una entrada por ID de cualquier tabla
async function getEntryById(table, idColumn, id) {
  const sql = `SELECT * FROM ${table} WHERE ${idColumn} = ?`;
  const [rows] = await sequelize.query(sql, { replacements: [id] });
  return rows[0];
}

// Función para actualizar una entrada por ID en cualquier tabla
async function updateEntryById(table, idColumn, id, columns, values) {
  const updates = columns.map(column => `${column} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${updates} WHERE ${idColumn} = ?`;
  const result = await sequelize.query(sql, { replacements: [...values, id] });
  return result;
}

// Función para eliminar una entrada por ID de cualquier tabla
async function deleteEntryById(table, idColumn, id) {
  const sql = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
  const result = await sequelize.query(sql, { replacements: [id] });
  return result;
}

// Definir los endpoint para las rutas CRUD

router.get('/entries/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const entries = await getEntries(table);
    res.json(entries);
  } catch (error) {
    res.status(500).send('Error al obtener las entradas');
  }
});

router.get('/entry/:table/:idColumn/:id', async (req, res) => {
  try {
    const { table, idColumn, id } = req.params;
    const entry = await getEntryById(table, idColumn, id);
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).send('Entrada no encontrada');
    }
  } catch (error) {
    res.status(500).send('Error al obtener la entrada');
  }
});

router.put('/update/:table/:idColumn/:id', async (req, res) => {
  try {
    const { table, idColumn, id } = req.params;
    const { columns, values } = req.body;
    const result = await updateEntryById(table, idColumn, id, columns, values);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error al actualizar la entrada');
  }
});

router.delete('/delete/:table/:idColumn/:id', async (req, res) => {
  try {
    const { table, idColumn, id } = req.params;
    const result = await deleteEntryById(table, idColumn, id);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error al eliminar la entrada');
  }
});

module.exports = router; 