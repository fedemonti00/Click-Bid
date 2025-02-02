const express = require("express");
const { createHash } = require("crypto");
const { ObjectId } = require("mongodb");
const { query, body } = require("express-validator");
const { connectToDatabase } = require("./db.js");
const app = express();


app.use(express.json());
app.use(express.urlencoded());
const router = express.Router();
const {
    checkIfLogged,
    checkIfTheUserIsTheCreator,
    checkIfUserCanMakeABid,
} = require("./scripts.js");


router.post("/auth/signup", async (req, res) => {
    const db = await connectToDatabase();
    const existingUser = await db
        .collection("users")
        .findOne({ username: req.body.username });
    if (existingUser) {
        res
            .status(409)
            .json({ message: "Username already taken" });
    } else if (
        req.body.username !== "" &&
        req.body.name !== "" &&
        req.body.surname !== "" &&
        req.body.password !== ""
    ) {
        const newHashPw = createHash("sha256")
            .update(req.body.password)
            .digest("hex");
        const newUser = {
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            password: newHashPw,
        };
        await db.collection("users").insertOne(newUser);

        res.status(201).json({ message: "User created successfully" });
    } else {
        res.status(400).json({ message: "Invalid fields" });
    }
});

router.post("/auth/signin", async (req, res) => {
    const db = await connectToDatabase();
    const user = await db
        .collection("users")
        .findOne({ username: req.body.username });
    if (user) {
        const hashPw = createHash("sha256").update(req.body.password).digest("hex");
        if (hashPw === user.password) {
            req.session.user = {
                username: user.username,
                name: user.name,
                surname: user.surname,
            };
            res.status(200).json({ message: "The authentication was successful" });
        } else {
            res.status(401).json({ message: "Wrong username or password" });
        }
    } else {
        res.status(401).json({ message: "Wrong username or password" });
    }
});

router.get("/users", query("q").escape(), query("flag").escape(), async (req, res) => {
    const db = await connectToDatabase();
    let users = null;

    if (!req.query.flag) {

        const query = req.query.q || "";
        const regex = new RegExp(`^${query}`, "i");
        users = await db
            .collection("users")
            .find({ username: regex })
            .sort({ username: 1 })
            .toArray();

    } else if (req.query.flag === "0") {
        if (req.query.q) {
            const query = req.query.q;
            users = await db
                .collection("users")
                .findOne({ username: query },
                    { projection: { username: 1, name: 1, surname: 1, _id: 0 } },
                );
        } else {
            res.status(400).json({ message: "Not all parameters are defined" });
        }
    } else {
        res.status(400).json({ message: "Uncorrected flag" });
    }


    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: "Users not found" });
    }
});

router.get("/users/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const db = await connectToDatabase();
    const query = { _id: new ObjectId(req.params.id) };
    const user = await db.collection("users").findOne(query);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

router.post(
    "/auctions",
    checkIfLogged,
    async (req, res) => {
        console.log(req.body)


        if (
            req.body.title !== "" && req.body.title !== null &&
            req.body.description !== "" && req.body.description !== null &&
            req.body.expiryDate !== "" && req.body.expiryDate !== null &&
            req.body.startingBid !== "" && req.body.startingBid !== null
        ) {
            try {
                const db = await connectToDatabase();

                const newAuction = {
                    owner: req.session.user.username,
                    title: req.body.title,
                    description: req.body.description,
                    expiryDate: req.body.expiryDate,
                    startingBid: req.body.startingBid,
                    currentHigherBid: req.body.startingBid,
                };

                await db.collection("auctions").insertOne(newAuction);

                res.status(201).json({ message: "Auction created successfully" });
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        } else {
            res.status(400).json({ message: "All fields are required" });
        }
    });

router.get("/auctions", query("q").trim().escape(), query("flag").escape(), async (req, res) => {
    try {
        const db = await connectToDatabase();
        let auctions = null;

        if (!req.query.flag) {

            if (req.query.q) {
                const query = req.query.q;
                const regex = new RegExp(`^${query}`, "i");
                auctions = await db
                    .collection("auctions")
                    .find({ title: regex })
                    .sort({ expiryDate: 1 })
                    .toArray();
            } else {
                auctions = await db
                    .collection("auctions")
                    .find({})
                    .sort({ expiryDate: 1 })
                    .toArray();
            }
        } else if (req.query.flag === "0") {
            if (req.query.q) {
                const query = req.query.q;
                auctions = await db
                    .collection("auctions")
                    .find({ owner: query })
                    .sort({ expiryDate: 1 })
                    .toArray();
            } else {
                res.status(400).json({ message: "Not all parameters are defined" });
            }
        } else {
            res.status(400).json({ message: "Uncorrected flag" });
        }

        if (!auctions) {
            return res.status(404).json({ message: "Auctions not found" });
        }

        const now = new Date();

        const upcoming = auctions
            .filter((a) => new Date(a.expiryDate) >= now)
            .map((a) => {
                const diff = new Date(a.expiryDate) - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                return {
                    ...a,
                    timeRemaining: `${hours}h ${minutes}m`
                };
            });

        const expired = auctions
            .filter((a) => new Date(a.expiryDate) < now)
            .map((a) => ({
                ...a,
                timeRemaining: "Auction expired"
            }));

        res.status(200).json({ upcoming, expired });
    } catch (error) {
        console.error("Error fetching auctions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/auctions/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const db = await connectToDatabase();
    const query = { _id: new ObjectId(req.params.id) };
    const auction = await db.collection("auctions").findOne(query);

    if (!auction) {
        return res.status(404).json({ message: "Auctions not found" });
    }

    const now = new Date();
    let auctionWithTime = null;

    if (new Date(auction.expiryDate) >= now) {
        const diff = new Date(auction.expiryDate) - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        auctionWithTime = {
            ...auction,
            timeRemaining: `${hours}h ${minutes}m`
        };
    } else {
        auctionWithTime = {
            ...auction,
            timeRemaining: "Auction expired"
        };
    }


    res.status(200).json(auctionWithTime);
});

router.put(
    "/auctions/:id",
    checkIfLogged,
    checkIfTheUserIsTheCreator,
    async (req, res) => {
        const db = await connectToDatabase();
        const query = { _id: new ObjectId(req.params.id) };
        const { title, description } = req.body;
        await db
            .collection("auctions")
            .updateOne(query, { $set: { title, description } });

        res.status(200).json({ message: "Auction updated successfully." });
    }
);

router.delete(
    "/auctions/:id",
    checkIfLogged,
    checkIfTheUserIsTheCreator,
    async (req, res) => {
        const db = await connectToDatabase();
        const query = { _id: new ObjectId(req.params.id) };
        await db.collection("auctions").deleteOne(query);

        res.status(200).json({ message: "Auction updated successfully." });
    }
);

router.post("/auctions/:id/bids", checkIfLogged, checkIfUserCanMakeABid, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const db = await connectToDatabase();
    const query = { _id: new ObjectId(req.params.id) };
    const bidValue = req.body.bidValue;

    const auction = await db.collection("auctions").findOne(query);

    if (bidValue > auction.currentHigherBid) {
        const newBid = {
            auctionId: new ObjectId(req.params.id),
            bidderUser: req.session.user.username,
            bidDate: new Date(),
            bidValue: bidValue,
        };

        await db.collection("auctions").updateOne(query, { $set: { currentHigherBid: bidValue } });
        await db.collection("bids").insertOne(newBid);

        res.status(201).json({ message: "Bid created successfully" });
    } else {
        res
            .status(400)
            .json({ message: "Bid is equal or lower to the current higher bid" });
    }
});

router.get("/auctions/:id/bids", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const db = await connectToDatabase();
    const query = { auctionId: new ObjectId(req.params.id) };
    const bids = await db.collection("bids").find(query).toArray();

    if (bids) {
        res.status(200).json(bids);
    } else {
        res.status(404).json({ message: "There are no bids yet" });
    }
});

router.get("/bids/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const db = await connectToDatabase();
    const query = { _id: new ObjectId(req.params.id) };
    const bid = await db.collection("bids").findOne(query);

    if (bid) {
        res.status(200).json(bid);
    } else {
        res.status(404).json({ message: "Bid not found" });
    }
});

router.get("/whoami", checkIfLogged, async (req, res) => {
    const { username, name, surname } = req.session.user;
    res.status(200).json({ username, name, surname });
});

module.exports = router;