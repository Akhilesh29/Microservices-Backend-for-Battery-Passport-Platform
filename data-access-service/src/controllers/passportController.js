const Passport = require("../models/Passport");
const { publishPassportEvent } = require("../config/kafka");

async function createPassport(req, res, next) {
  try {
    if (!req.body?.data) {
      return res.status(400).json({ message: "Passport data is required" });
    }

    const passport = await Passport.create({
      data: req.body.data,
      createdBy: req.user,
      updatedBy: req.user,
    });

    await publishPassportEvent("passport.created", passport, req.user);

    res.status(201).json(passport);
  } catch (error) {
    next(error);
  }
}

async function getPassport(req, res, next) {
  try {
    const passport = await Passport.findById(req.params.id);
    if (!passport) {
      return res.status(404).json({ message: "Passport not found" });
    }

    res.status(200).json(passport);
  } catch (error) {
    next(error);
  }
}

async function updatePassport(req, res, next) {
  try {
    if (!req.body?.data) {
      return res.status(400).json({ message: "Passport data is required" });
    }

    const passport = await Passport.findByIdAndUpdate(
      req.params.id,
      {
        data: req.body.data,
        updatedBy: req.user,
      },
      { new: true, runValidators: true }
    );

    if (!passport) {
      return res.status(404).json({ message: "Passport not found" });
    }

    await publishPassportEvent("passport.updated", passport, req.user);

    res.status(200).json(passport);
  } catch (error) {
    next(error);
  }
}

async function deletePassport(req, res, next) {
  try {
    const passport = await Passport.findByIdAndDelete(req.params.id);
    if (!passport) {
      return res.status(404).json({ message: "Passport not found" });
    }

    await publishPassportEvent("passport.deleted", passport, req.user);

    res.status(200).json({ message: "Passport deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPassport,
  getPassport,
  updatePassport,
  deletePassport,
};
