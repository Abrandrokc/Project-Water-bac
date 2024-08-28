import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

import { getAllContacts, getContactById } from './services/contacts.js';


dotenv.config();


const setupServer = () => {
  const app = express();
  const PORT = 3000;


  app.use(cors());
  app.use(pino());

  app.get('/', (req, res) => {
    res.send('Home page');
  });


  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: error.message,
      });
    }
  });


  app.get('/contacts/:contactId', async (req, res) => {
    const contactId = req.params.contactId;
    try {
      const contact = await getContactById(contactId);
      if (contact) {
        res.status(200).json({
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        });
      } else {
        res
          .status(404)
          .json({
            status: 404,
            message: `Contact with id ${contactId} not found`,
          });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contact',
        error: error.message,
      });
    }
  });

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
