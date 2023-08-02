const createError = require('http-errors');
const mongoose = require('mongoose');

const Check = require('../models/Check.js');

module.exports = {
  getAllChecks: async (req, res, next) => {
    try {
      const results = await Check.find({}, { __v: 0 });
      // const results = await Check.find({}, { name: 1, price: 1, _id: 0 });
      // const results = await Check.find({ price: 699 }, {});
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          results
        }
    });
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewCheck: async (req, res, next) => {
    try {
      const check = new Check(req.body);
      const result = await check.save();
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          result
        }
      })
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findCheckById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const Check = await Check.findById(id);
      // const Check = await Check.findOne({ _id: id });
      if (!Check) {
        throw createError(404, 'Check does not exist.');
      }
      res.send(Check);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Check id'));
        return;
      }
      next(error);
    }
  },

  updateCheck: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await Check.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Check does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Check Id'));
      }

      next(error);
    }
  },

  deleteCheck: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Check.findByIdAndDelete(id);
      // console.log(result);
      if (!result) {
        throw createError(404, 'Check does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Check id'));
        return;
      }
      next(error);
    }
  }
};