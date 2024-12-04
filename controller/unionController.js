const pool = require('../db');
const { user_union, union, chat } = require('../models');
const userUnion = require('../models/user-union');
const { v4: uuidv4 } = require('uuid')
const getUnions = async (req, res) => {
  try {
    const { unionname, location, organization } = req.query;

    // SQL query to join unions with workplaces and filter based on query parameters
    let query = `
      SELECT 
        unions.id, 
        unions.name, 
        unions.description,
        unions.visibility,
        workplaces.organization, 
        workplaces.state AS location 
      FROM unions
      LEFT JOIN workplaces 
        ON unions.id = workplaces."unionId"
      WHERE 1=1
    `;

    const queryParams = [];

    if (unionname) {
      queryParams.push(`%${unionname}%`);
      query += ` AND unions.name ILIKE $${queryParams.length}`;
    }

    if (location) {
      queryParams.push(`%${location}%`);
      query += ` AND workplaces.state ILIKE $${queryParams.length}`;
    }

    if (organization) {
      queryParams.push(`%${organization}%`);
      query += ` AND workplaces.organization ILIKE $${queryParams.length}`;
    }

    console.log('Query:', query, 'Params:', queryParams);

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: 'No unions found for the specified criteria',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching unions: ', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching unions.',
    });
  }
};

const getUserUnions = async (req, res) => {
  const { userId } = req.query
  const userUnions = await user_union.findAll({
    where: {
      userId: `${userId}`
    }
  })
  const unions = []
  console.log(userUnions)
  for (const userUnion of userUnions) {
    const curr = await union.findByPk(userUnion.dataValues.unionId);
    const chats = await chat.findAll({
      where: {
        unionId: userUnion.dataValues.unionId
      }
    })
    curr.dataValues.chats = chats.map((chat) => chat.dataValues)
    if (curr) {
      unions.push(curr.dataValues);
    }
  }


  res.status(200).json({ message: `unions for ${userId} received`, data: unions })
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
  getUnionPublicChats
};