import express from "express"; // Importa il pacchetto Express
import User from "../models/User.js"; // Importa il modello User

const router = express.Router(); // Crea un router Express

// Rotta per ottenere tutti gli utenti senza paginazione
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({}); // Trova tutti gli utenti nel database
//     res.json(users); // Risponde con i dati degli utenti in formato JSON
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
//   }
// });

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // estra il numero di pagina dalla query, default a 1 se non specificato
    const limit = parseInt(req.query.limit) || 5; // estrae il limite di risultati per pagina, di default mostra 5 risultati
    const sort = req.query.sort || "name"; // determina il campo per l'ordinamento, default a "name"
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; //determina la direzione dell'ordinamento
    const skip = (page - 1) * limit; // calcola quanti documenti saltare per arrivare alla pagina richiesta

    // esegue la query al database con paginazione, ordinamento e limite
    const users = await User.find({})
      .sort({ [sort]: sortDirection }) // ordina i risultati
      .skip(skip) // salta i documenti delle pagine precedenti
      .limit(limit); // limita il numero di risultati

    // conta il numero totale di utenti nel database
    const total = await User.countDocuments();

    // invia la risposta JSON con i dati degli utenti e tutte le informazioni di paginazione
    res.json({
      users, // array degli utenti per la pagina corrente
      currentPage: page, // numero della pagina corrente
      totalPages: Math.ceil(total / limit), // calcola il numero totale di pagine
      totalUsers: total, // numero totale di utenti nel database
    });
  } catch (err) {
    // gestisce eventuali errori inviando un messaggio di errore
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo utente
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Trova un utente per ID
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }
    res.json(user); // Risponde con i dati dell'utente in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per creare un nuovo utente
router.post("/", async (req, res) => {
  const user = new User(req.body); // Crea un nuovo utente con i dati dal corpo della richiesta
  try {
    const newUser = await user.save(); // Salva il nuovo utente nel database

    // Rispondi con l'ID come primo dato
    res.status(201).json({
      _id: newUser._id, // Mostra l'ID per primo
      ...newUser.toObject(), // Aggiungi gli altri campi
    });
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per aggiornare un utente
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
      runValidators: true, // Esegue la validazione dello schema
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utente non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }

    res.json({
      _id: updatedUser._id, // Mostra l'ID per primo
      ...updatedUser.toObject(), // Aggiungi gli altri campi
    }); // Risponde con i dati dell'utente aggiornato in formato JSON
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per eliminare un utente (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Elimina un utente per ID
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }
    res.json({ message: "Utente eliminato", _id: req.params.id }); // Risponde con un messaggio di conferma e l'ID dell'utente eliminato
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

export default router; // Esporta il router per l'utilizzo in altri file
