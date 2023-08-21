const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const sequelize = new Sequelize(process.env.MYSQL_DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
});

const LifeSense = sequelize.define('LifeSense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lifeSense: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to MySQL and synchronized models");
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
})();

app.get("/", async function (req, res) {
  res.send("Hello,world!");
})

app.get("/lifesense", async function (req, res) {
  try {
    const lifesense = await LifeSense.findAll();
    res.json(lifesense);
  } catch (error) {
    console.error("Error fetching lifesense:", error);
    res.status(500).json({ message: "Error fetching lifesense" });
  }
});

app.post("/lifesense", async function (req, res) {
  const newLifeSense = req.body;

  try {
    const createdLifeSense = await LifeSense.create(newLifeSense);
    res.status(201).json(createdLifeSense);
  } catch (error) {
    console.error("Error inserting lifeSense:", error);
    res.status(500).json({ message: "Error inserting lifeSense" });
  }
});

app.delete("/lifesense/:id", async function (req, res) {
  const lifeSenseId = req.params.id;

  try {
    const deletedLifeSense = await LifeSense.destroy({ where: { id: lifeSenseId } });

    if (deletedLifeSense === 0) {
      res.status(404).json({ message: "LifeSense not found" });
    } else {
      res.status(200).json({ message: "LifeSense deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting lifeSense:", error);
    res.status(500).json({ message: "Error deleting lifeSense" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
