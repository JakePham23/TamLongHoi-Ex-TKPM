import api from './api';

const getAllClasses = async () => {
  const response = await api.get('/classes');
  return response.data;
};

const getClassById = async (id) => {
  const response = await api.get(`/classes/${id}`);
  return response.data;
};

const addClass = async (classData) => {
  const response = await api.post('/classes', classData);
  return response.data;
};

const updateClass = async (id, classData) => {
  const response = await api.put(`/classes/${id}`, classData);
  return response.data;
};

const deleteClass = async (id) => {
  await api.delete(`/classes/${id}`);
};

export default {
  getAllClasses,
  getClassById,
  addClass,
  updateClass,
  deleteClass
};