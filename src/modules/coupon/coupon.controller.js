import couponModel from "../../../DB/model/coupon.model.js";

export const createCoupon = async (req, res, next) => {
  const { name } = req.body;
  req.body.expireDate = new Date(req.body.expireDate);
  if (await couponModel.findOne({ name })) {
    return next(new Error("Coupon name already exists!", { cause: 409 }));
  }
  const coupon = await couponModel.create(req.body);
  return res.status(201).json({ message: "success", coupon });
};

export const getCoupon = async (req, res) => {
  const coupons = await couponModel.find({});
  return res.status(200).json({ message: "success", coupons });
};

export const getSpecificCoupon = async (req, res) => {
  const { id } = req.params;
  const coupon = await couponModel.findById(id);
  return res.status(200).json({ message: "success", coupon });
};

export const updateCoupon = async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.id);
  if (!coupon) {
    return next(new Error("Coupon not found!", { cause: 404 }));
  }
  if (req.body.name) {
    if (await couponModel.findOne({ name: req.body.name }).select("name")) {
      return next(
        new Error(`coupon ${req.body.name} already exists`, { cause: 409 })
      );
    }
    coupon.name = req.body.name;
  }
  if (req.body.amount) {
    coupon.amount = req.body.amount;
  }
  await coupon.save();
  return res.status(200).json({ message: "success", coupon });
};

export const softDelete = async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!coupon) {
    return next(new Error("Con't delete this coupon!", { cause: 400 }));
  }
  return res.status(200).json({ message: "success", coupon });
};

export const restore = async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndUpdate(
    { _id: id, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );
  if (!coupon) {
    return next(new Error("Con't restore this coupon!", { cause: 400 }));
  }
  return res.status(200).json({ message: "success", coupon });
};

export const hardDelete = async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndDelete({ _id: id });
  if (!coupon) {
    return next(new Error("Con't delete this coupon!", { cause: 400 }));
  }
  return res.status(200).json({ message: "success", coupon });
};
