const { workplace, chat } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Get all workplaces
const getWorkplaces = async (req, res) => {
  const { unionId } = req.query;

  if (!unionId) {
    return res.status(400).json({ status: 'fail', message: 'Union ID is required.' });
  }

  try {
    const workplaces = await workplace.findAll({
      where: { unionId },
    });

    if (workplaces.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No workplaces found for this union ID.' });
    }

    res.status(200).json({ status: 'success', data: workplaces });
  } catch (error) {
    console.error('Error fetching workplaces:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

// Get workplaces by unionId
const getWorkplacesByUnionId = async (req, res) => {
  try {
    const { unionId } = req.query; 
    if (!unionId) {
      return res.status(400).json({ message: 'Union ID is required to fetch workplaces.' });
    }

    const workplaces = await workplace.findAll({ where: { unionId } });

    if (!workplaces.length) {
      return res.status(404).json({ message: 'No workplaces found for the given union.' });
    }

    return res.status(200).json({ status: 'success', workplaces });
  } catch (error) {
    console.error('Error fetching workplaces:', error);
    return res.status(500).json({ message: 'Failed to fetch workplaces.' });
  }
};


// Create a workplace
const createWorkplace = async (req, res) => {
    const { workplaceName, organization, city, street, unionId } = req.body;
    try {
        if (!unionId || !workplaceName || !organization || !city) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }
        const newWorkplace = await workplace.create({
            id: uuidv4(),
            workplaceName,
            organization,
            city,
            street,
            unionId,
        });
        res.status(201).json({ status: 'success', data: newWorkplace });
    } catch (error) {
        console.error('Error creating workplace:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create workplace.' });
    }
};

// Delete a workplace by ID
const deleteWorkplace = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await workplace.destroy({ where: { id } });
        if (result) {
            res.status(200).json({ status: 'success', message: 'Workplace deleted successfully.' });
        } else {
            res.status(404).json({ status: 'error', message: 'Workplace not found.' });
        }
    } catch (error) {
        console.error('Error deleting workplace:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete workplace.' });
    }
};

module.exports = {
    getWorkplaces,
    getWorkplacesByUnionId,
    createWorkplace,
    deleteWorkplace,
};
