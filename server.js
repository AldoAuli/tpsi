const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Abilita CORS per permettere richieste dal frontend
app.use(cors());

// Middleware per elaborare il corpo delle richieste in formato JSON
app.use(express.json());

// Configurazione del database MySQL
const db = mysql.createConnection({
  host: 'proxy.marconicloud.it',
  user: 'a_utente01',
  password: 'a_utente01',
  database: 'a_lab5Ainf_utente01',
  port: 3307
});

// Connessione al database
db.connect((err) => {
  if (err) throw err;
  console.log('Connesso al database MySQL');
});

// API per ottenere tutti gli utenti (inclusi tipo_contratto, ruolo, e data_assunzione)
app.get('/api/users', (req, res) => {
  const query = `
    SELECT id, nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione
    FROM users
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
      return;
    }
    res.json(results);
  });
});

// API per aggiungere un nuovo utente (inclusi tipo_contratto, ruolo, e data_assunzione)
app.post('/api/users', (req, res) => {
  const { nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione } = req.body;

  // Verifica che tutti i campi siano presenti
  if (!nome || !cognome || !email || !data_di_nascita || !tipo_contratto || !ruolo || !data_assunzione) {
    res.status(400).send('Tutti i campi (nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione) sono obbligatori');
    return;
  }

  // Controlla se l'email esiste già nel database
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
      return;
    }

    if (results.length > 0) {
      // L'email esiste già
      res.status(400).send('Un utente con questa email esiste già');
      return;
    }

    // Se l'email non esiste, inserisci il nuovo utente
    const query = `
      INSERT INTO users (nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione], (err, result) => {
      if (err) {
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
        return;
      }
      res.status(201).json({
        id: result.insertId,
        nome,
        cognome,
        email,
        data_di_nascita,
        tipo_contratto,
        ruolo,
        data_assunzione
      });
    });
  });
});

// API per modificare un utente esistente (inclusi tipo_contratto, ruolo, e data_assunzione)
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione } = req.body;

  if (!nome || !cognome || !email || !data_di_nascita || !tipo_contratto || !ruolo || !data_assunzione) {
    res.status(400).send('Tutti i campi (nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione) sono obbligatori');
    return;
  }

  // Aggiorna l'utente nel database
  const query = `
    UPDATE users 
    SET nome = ?, cognome = ?, email = ?, data_di_nascita = ?, tipo_contratto = ?, ruolo = ?, data_assunzione = ?
    WHERE id = ?
  `;
  db.query(query, [nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione, id], (err, result) => {
    if (err) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
      return;
    }
    res.status(200).json({
      id,
      nome,
      cognome,
      email,
      data_di_nascita,
      tipo_contratto,
      ruolo,
      data_assunzione
    });
  });
});

// API per eliminare un utente
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
      return;
    }
    res.status(200).send('Utente eliminato con successo');
  });
});

// Avvio del server
app.listen(3000, () => {
  console.log(`Server in esecuzione su http://localhost:3000`);
});
