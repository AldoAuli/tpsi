const API_URL = 'http://localhost:3000/api/users';

// Funzione per caricare la lista degli utenti
function fetchUsers() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const usersDiv = document.getElementById('users');
      usersDiv.innerHTML = '<h3>Lista Utenti</h3>';
      if (data.length === 0) {
        usersDiv.innerHTML += '<p>Nessun utente trovato.</p>';
        return;
      }
      const table = document.createElement('table');
      table.classList.add('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Email</th>
            <th>Data di Nascita</th>
            <th>Tipo Contratto</th>
            <th>Ruolo</th>
            <th>Data di Assunzione</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(user => `
            <tr>
              <td>${user.id}</td>
              <td>${user.nome}</td>
              <td>${user.cognome}</td>
              <td>${user.email}</td>
              <td>${user.data_di_nascita}</td>
              <td>${user.tipo_contratto}</td>
              <td>${user.ruolo}</td>
              <td>${user.data_assunzione}</td>
              <td>
                <button class="btn btn-warning" 
                        onclick="editUser(${user.id}, '${user.nome}', '${user.cognome}', '${user.email}', '${user.data_di_nascita}', '${user.tipo_contratto}', '${user.ruolo}', '${user.data_assunzione}')">Modifica</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Elimina</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      `;
      usersDiv.appendChild(table);
    })
    .catch(error => console.error('Errore nel recupero degli utenti:', error));
}

// Funzione per eliminare un utente
function deleteUser(id) {
  if (confirm('Sei sicuro di voler eliminare questo utente?')) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          alert('Utente eliminato con successo');
          fetchUsers();
        } else {
          alert('Errore nell\'eliminazione dell\'utente');
        }
      })
      .catch(error => console.error('Errore nell\'eliminazione dell\'utente:', error));
  }
}

// Funzione per modificare un utente (precompila il form)
function editUser(id, nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione) {
  document.getElementById('form-title').innerText = 'Modifica Utente';
  document.getElementById('user-id').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('cognome').value = cognome;
  document.getElementById('email').value = email;
  document.getElementById('data_di_nascita').value = data_di_nascita;
  document.getElementById('tipo_contratto').value = tipo_contratto;
  document.getElementById('ruolo').value = ruolo;
  document.getElementById('data_assunzione').value = data_assunzione;
}

// Funzione per aggiungere o aggiornare un utente
function submitUser(event) {
  event.preventDefault();
  
  const id = document.getElementById('user-id').value;
  const nome = document.getElementById('nome').value;
  const cognome = document.getElementById('cognome').value;
  const email = document.getElementById('email').value;
  const data_di_nascita = document.getElementById('data_di_nascita').value;
  const tipo_contratto = document.getElementById('tipo_contratto').value;
  const ruolo = document.getElementById('ruolo').value;
  const data_assunzione = document.getElementById('data_assunzione').value;

  if (!nome || !cognome || !email || !data_di_nascita || !tipo_contratto || !ruolo || !data_assunzione) {
    alert('Tutti i campi sono obbligatori');
    return;
  }

  const user = { nome, cognome, email, data_di_nascita, tipo_contratto, ruolo, data_assunzione };

  if (id) {
    // Modifica utente
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(response => {
        if (response.ok) {
          alert('Utente modificato con successo');
          resetForm();
          fetchUsers();
        } else {
          alert('Errore nella modifica dell\'utente');
        }
      })
      .catch(error => console.error('Errore nella modifica dell\'utente:', error));
  } else {
    // Aggiungi nuovo utente
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(response => {
        if (response.ok) {
          alert('Utente aggiunto con successo');
          resetForm();
          fetchUsers();
        } else {
          alert('Errore nell\'aggiunta dell\'utente');
        }
      })
      .catch(error => console.error('Errore nell\'aggiunta dell\'utente:', error));
  }
}

// Funzione per resettare il form
function resetForm() {
  document.getElementById('form-title').innerText = 'Aggiungi Utente';
  document.getElementById('user-id').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('cognome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('data_di_nascita').value = '';
  document.getElementById('tipo_contratto').value = '';
  document.getElementById('ruolo').value = '';
  document.getElementById('data_assunzione').value = '';
}

fetchUsers();
