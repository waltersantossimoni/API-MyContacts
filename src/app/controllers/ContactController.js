const ContactsRepository = require('../repositories/ContactsRepository');
const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(req, res) {
    // Listar todos os registros
    const { orderBy } = req.query;
    const contacts = await ContactsRepository.findAll(orderBy);
    res.json(contacts);
  }

  async show(req, res) {
    // Obter UM registro
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  }

  async store(req, res) {
    // Criar novo registro
    const {
      name, email, phone, category_id,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return res.status(400).json({ error: 'Invalid category id' });
    }

    if (email) {
      const contactExists = await ContactsRepository.findByEmail(email);

      if (contactExists) {
        return res.status(400).json({ error: 'This email is already in use.' });
      }
    }

    const contact = await ContactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    res.status(201).json(contact);
  }

  async update(req, res) {
    // Editar um registro
    const { id } = req.params;
    const {
      name, email, phone, category_id,
    } = req.body;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return res.status(400).json({ error: 'Invalid category id' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const contactExists = await ContactsRepository.findById(id);

    if (!contactExists) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    if (email) {
      const contactByEmail = await ContactsRepository.findByEmail(email);

      if (contactByEmail && contactByEmail.id !== id) {
        return res.status(400).json({ error: 'This email is already in use.' });
      }
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    res.json(contact);
  }

  async delete(req, res) {
    // Deletar um registro
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    await ContactsRepository.delete(id);
    res.sendStatus(204);
  }
}

module.exports = new ContactController();
