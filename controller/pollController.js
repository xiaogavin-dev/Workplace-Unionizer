const { poll } = require('../models');

// Fetch polls by unionId
const getPollsByUnionId = async (req, res) => {
  try {
    const { unionId } = req.query;

    if (!unionId) {
      return res.status(400).json({ message: "unionId is required" });
    }

    const polls = await poll.findAll({
      where: { unionId },
    });

    if (!polls || polls.length === 0) {
      return res.status(404).json({ message: "No polls found for this union" });
    }

    res.status(200).json({ polls });
  } catch (error) {
    console.error("Error fetching polls by unionId:", error);
    res.status(500).json({ message: "An error occurred while fetching polls" });
  }
};

const getPollsByWorkplaceId = async (req, res) => {
    try {
      const { workplaceId } = req.query;
  
      // Validate input
      if (!workplaceId || typeof workplaceId !== 'string') {
        return res.status(400).json({ message: "Invalid or missing workplaceId" });
      }
  
      console.log("Fetching polls for workplaceId:", workplaceId);
  
      // Query the database
      const polls = await poll.findAll({
        where: { workplaceId },
      });
  
      if (!polls || polls.length === 0) {
        return res.status(404).json({ message: "No polls found for this workplace" });
      }
  
      res.status(200).json({ polls });
    } catch (error) {
      console.error("Error fetching polls by workplaceId:", error);
      res.status(500).json({ message: "An error occurred while fetching polls" });
    }
  };
  
  const handleVote = async (req, res) => {
    try {
      console.log("Request Body:", req.body);
  
      const { workplaceId, vote, action } = req.body;
  
      if (!workplaceId || !vote || !action) {
        console.error("Missing parameters:", { workplaceId, vote, action });
        return res.status(400).json({ message: "workplaceId, vote, and action are required" });
      }
  
      if (!["yes", "no"].includes(vote)) {
        console.error("Invalid vote option:", vote);
        return res.status(400).json({ message: "Vote must be 'yes' or 'no'" });
      }
  
      if (!["increment", "decrement"].includes(action)) {
        console.error("Invalid action:", action);
        return res.status(400).json({ message: "Action must be 'increment' or 'decrement'" });
      }
  
      console.log("Finding poll for workplaceId:", workplaceId);
  
      // Find the poll associated with the workplace
      const pollToUpdate = await poll.findOne({
        where: { workplaceId },
      });
  
      if (!pollToUpdate) {
        console.error("Poll not found for workplaceId:", workplaceId);
        return res.status(404).json({ message: "Poll not found for the given workplaceId" });
      }
  
      console.log("Poll found:", pollToUpdate);
  
      // Adjust vote counts based on the action
      if (action === "increment") {
        if (vote === "yes") {
          pollToUpdate.yesCount += 1;
        } else if (vote === "no") {
          pollToUpdate.noCount += 1;
        }
      } else if (action === "decrement") {
        if (vote === "yes" && pollToUpdate.yesCount > 0) {
          pollToUpdate.yesCount -= 1;
        } else if (vote === "no" && pollToUpdate.noCount > 0) {
          pollToUpdate.noCount -= 1;
        }
      }
  
      console.log("Updated poll counts:", {
        yesCount: pollToUpdate.yesCount,
        noCount: pollToUpdate.noCount,
      });
  
      await pollToUpdate.save();
  
      res.status(200).json({
        message: "Vote action handled successfully",
        yesCount: pollToUpdate.yesCount,
        noCount: pollToUpdate.noCount,
      });
    } catch (error) {
      console.error("Error handling votes:", error);
      res.status(500).json({ message: "An error occurred while handling the vote" });
    }
  };
  
  const getVotes = async (req, res) => {
    try {
      const { workplaceId } = req.query;
  
      if (!workplaceId) {
        return res.status(400).json({ message: "workplaceId is required" });
      }
  
      // Find the poll associated with the workplace
      const pollData = await poll.findOne({
        where: { workplaceId },
        attributes: ["yesCount", "noCount"], // Retrieve only the counts
      });
  
      if (!pollData) {
        return res.status(404).json({ message: "Poll not found for the given workplaceId" });
      }
  
      res.status(200).json({
        yesCount: pollData.yesCount,
        noCount: pollData.noCount,
      });
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ message: "An error occurred while fetching votes" });
    }
  };

module.exports = { getPollsByUnionId, getPollsByWorkplaceId, handleVote, getVotes };