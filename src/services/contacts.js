import { Contact } from '../db/Contact.js';


export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error('No contacts: ' + error.message);
  }
};


export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    throw new Error('No contact: ' + error.message);
  }
};
