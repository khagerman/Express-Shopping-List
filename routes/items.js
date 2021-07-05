const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", function (req, res, next) {
  try {
    res.json({ items });
  } catch (error) {
    return next(err);
  }
});

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    if (!req.body.price) throw new ExpressError("Price is required", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (err) {
    return next(err);
  }
});

router.get("/:name", function (req, res, next) {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    }
    return res.json(foundItem);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:name", function (req, res, next) {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    }

    foundItem.name = req.body.name || foundItem.name;
    foundItem.price = req.body.price || foundItem.price;
    return res.json({ updated: foundItem });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:name", function (req, res, next) {
  try {
    const foundItem = items.findIndex((item) => item.name === req.params.name);
    if (foundItem === -1) {
      throw new ExpressError("item not found", 404);
    }
    items.splice(foundItem, 1);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
