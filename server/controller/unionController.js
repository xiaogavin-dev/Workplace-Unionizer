const pool = require('../db');
const { Op } = require('sequelize');
const { user_union, workplace, union, chat, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid')
async function getUnions(req, res) {
  try {
    const { unionname, location, organization } = req.query;

    // Define the where clauses dynamically
    const unionWhere = {
      visibility: 'public', // Matches the `WHERE unions.visibility = 'public'`
    };

    if (unionname) {
      unionWhere.name = { [Op.iLike]: `%${unionname}%` }; // ILIKE equivalent
    }

    const workplaceWhere = {};
    if (location) {
      workplaceWhere.state = { [Op.iLike]: `%${location}%` }; // ILIKE equivalent
    }
    if (organization) {
      workplaceWhere.organization = { [Op.iLike]: `%${organization}%` }; // ILIKE equivalent
    }

    // Perform the query with associations
    const unions = await union.findAll({
      where: unionWhere,
      include: [
        {
          model: workplace,
          as: 'associatedWorkplaces', // Ensure this matches your association alias
          where: Object.keys(workplaceWhere).length ? workplaceWhere : undefined,
          required: false, // Equivalent to LEFT JOIN
        },
      ],
      attributes: [
        'id',
        'name',
        'description',
        'visibility',
        'image',
      ],
    });

    if (unions.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: 'No unions found for the specified criteria',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: unions,
    });
  } catch (error) {
    console.error('Error fetching unions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching unions',
    });
  }
}

const getUserUnions = async (req, res) => {
  const { userId } = req.query
  try {
    const userUnions = await user_union.findAll({
      where: {
        userId: `${userId}`
      }
    })
    const unions = []
    for (const userUnion of userUnions) {
      const curr = await union.findByPk(userUnion.dataValues.unionId);
      const chats = await chat.findAll({
        where: {
          unionId: userUnion.dataValues.unionId,
          workplaceId: null
        }
      })
      curr.dataValues.chats = chats.map((chat) => chat.dataValues)
      curr.dataValues.role = userUnion.dataValues.role
      if (curr) {
        unions.push(curr.dataValues);
      }
    }
    res.status(200).json({ message: `unions for ${userId} received`, data: unions })
  }
  catch (error) {
    console.log("there was an error getting user-unions: ", error)
    res.status(400).json({ message: "There was an error getting user unions" })
  }
}
const joinUnion = async (req, res) => {
  const { userUnionInfo } = req.body
  console.log(userUnionInfo)
  try {
    const joined = await user_union.create({
      id: uuidv4(),
      userId: userUnionInfo.userId,
      role: userUnionInfo.role,
      unionId: userUnionInfo.unionId
    })
    res.status(200).json({ message: "joined successfully", data: joined.dataValues })
  } catch (error) {
    console.error(error)
  }
}
const leaveUnion = async (req, res) => {
  const { unionId, userId } = req.body;
  const transaction = await sequelize.transaction()
  try {
    await user_union.destroy({ where: { unionId, userId } }, transaction)
    await transaction.commit()
    res.status(200).json({ message: "successfully left union" })
  }
  catch (error) {
    await transaction.rollback()
    console.error("There was an error leaving Union.", error)
    res.status(400).json({ message: "Could not leave union" })
  }
}
const deleteUnion = async (req, res) => {
  const { unionId, userId } = req.body;
  const transaction = await sequelize.transaction()
  try {
    const user_union_response = await user_union.findOne({
      where: {
        unionId,
        userId
      }
    })
    if (user_union_response.dataValues.role == 'admin') {
      await union.destroy({ where: { id: unionId } }, transaction)
      await transaction.commit()
      res.status(200).json({ message: "successfully deleted" })
    }
    else {
      res.staus(200).json({ message: "user does not have permissions to delete the union" })
    }
  }
  catch (error) {
    await transaction.rollback()
    console.error("There was an error deleting Union.", error)
    res.status(400).json({ message: "Could not delete union" })

  }
}
const getUnionPublicChats = async (req, res) => {
  const { unionId } = req.query
  try {
    const publicChatInstances = await chat.findAll({
      where: {
        isPublic: true,
        unionId
      }
    })
    const publicChats = []
    for (const publicChat of publicChatInstances) {
      publicChats.push(publicChat.dataValues)
    }
    res.status(200).json({ message: 'Chats returned', data: publicChats })
  } catch (error) {
    console.log("Error in 'getUnionPublicChats", error)
    res.status(400).json({ data: error })
  }
}


module.exports = {
  getUnions,
  getUserUnions,
  joinUnion,
  getUnionPublicChats,
  leaveUnion,
  deleteUnion
}