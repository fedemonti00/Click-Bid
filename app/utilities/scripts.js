const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("./db.js");


const checkIfLogged = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
} else {
    res.status(401).json({ message: "Unauthorized" });
}
};

const checkIfTheUserIsTheCreator = async (req, res, next) => {
  try {
    const db = await connectToDatabase(); 
    const id = req.params.id; 

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };
    const auction = await db.collection("auctions").findOne(query);

    if (auction) {
      if (auction.owner === req.session.user.username) {
        next();
      } else {
        res.status(403).json({
          message: "You are not authorized to modify this auction.",
        });
      }
    } else {
      res.status(404).json({ message: "Auction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkIfUserCanMakeABid = async (req, res, next) => {
  try {
    const db = await connectToDatabase(); 
    const id = req.params.id; 

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };
    const auction = await db.collection("auctions").findOne(query);

    if (auction) {
      if (auction.owner !== req.session.user.username) {
        next();
      } else {
        res.status(403).json({
          message: "You are not authorized to make a bid, you are the creator.",
        });
      }
    } else {
      res.status(404).json({ message: "Auction not found" });
    }
  } catch (error) {
    console.error("Error checking auction creator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  checkIfLogged,
  checkIfTheUserIsTheCreator,
  checkIfUserCanMakeABid,
};
