import express from 'express';
import RegistrationController from '../controllers/registration.controller.js';

const router = express.Router();

router.post('/add', RegistrationController.addRegistration);
router.delete('/:RegistrationId', RegistrationController.deleteRegistration);
router.put('/:RegistrationId', RegistrationController.updateRegistration);
router.get('/', RegistrationController.getAllRegistrations);

export default router; 