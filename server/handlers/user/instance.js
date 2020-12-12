import db from "../../models/index.js";

export const getInstances = async function (req, res, next) {
  try {
    let instances = (await db.User.findById(req.body.decoded.id)).instances;
    return res.status(200).json({
      instances,
    });
  } catch (err) {
    return next(err);
  }
};

export const createInstance = async function (req, res, next) {
  try {
    console.log(req.body.data);
    let instances = (
      await db.User.findByIdAndUpdate(
        req.body.decoded.id,
        { $push: { instances: req.body.data } },
        { new: true }
      )
    ).instances;
    return res.status(200).json({
      message: "instance created successfully",
      instances,
    });
  } catch (err) {
    return next(err);
  }
};

export const getInstance = async function (req, res, next) {
  try {
    let instances = (await db.User.findById(req.body.decoded.id)).instances;
    return res.status(200).json({
      instance: instances.find(
        (instance) => instance._id === req.params.instanceId
      ),
    });
  } catch (err) {
    return next(err);
  }
};

export const editInstance = async function (req, res, next) {
  try {
    let instances = await db.User.updateOne(
      {
        _id: req.body.decoded.id,
        "instances._id": req.params.instanceId,
      },
      { $set: { "instances.$": req.body.data } },
      { new: true }
    );
    return res.status(200).json({
      message: "instance updated successfully",
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteInstance = async function (req, res, next) {
  try {
    await db.User.updateOne(
      { _id: req.body.decoded.id },
      { $pull: { instances: { _id: req.params.instanceId } } }
    );
    return res.status(200).json({
      message: "instance deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};
