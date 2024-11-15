const { union, workplace } = require('../models');
const { Op } = require('sequelize');

const searchUnions = async (req, res) => {
    const { unionname, location, organization } = req.query;
    console.log("Query Parameters:", req.query);

    const unionQuery = {};

    if (unionname) {
        unionQuery.name = { [Op.iLike]: `%${unionname}%` };
    }

    const workplaceQuery = {};

    if (location) {
        const [city, state] = location.split(',').map(part => part.trim());
        if (city) workplaceQuery.city = { [Op.iLike]: `%${city}%` };
        if (state) workplaceQuery.state = { [Op.iLike]: `%${state}%` };
    }

    if (organization) {
        workplaceQuery.organization = { [Op.iLike]: `%${organization}%` };
    }

    try {
        const unions = await union.findAll({
            where: unionQuery,
            include: [{
                model: workplace,
                as: 'associatedWorkplaces',  
                where: workplaceQuery,
                required: true  
            }]
        });

        res.status(200).json({ status: 'success', data: unions });
    } catch (error) {
        console.error("Error fetching unions:", error);
        res.status(500).json({ status: 'error', message: 'An error occurred during the search.' });
    }
};

module.exports = {
    searchUnions,
};
