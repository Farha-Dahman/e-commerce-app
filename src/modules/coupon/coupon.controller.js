import couponModel from "../../../DB/model/coupon.model.js";

export const createCoupon = async (req, res) => {
  const { name, amount } = req.body;
  if (await couponModel.findOne({ name })) {
    return res.status(409).json({ message: "coupon name already exists" });
  }
  const coupon = await couponModel.create(req.body);
  return res.status(201).json({ message: "success", coupon });
};

export const getCoupon = async (req, res) => {
  const coupons = await couponModel.find({});
  return res.status(200).json({ message: "success", coupons });
};

export const updateCoupon = async (req, res) => {
  const coupon = await couponModel.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: "coupon not found" });
  }
  if (req.body.name) {
    if (await couponModel.findOne({ name: req.params.name }).select("name")) {
      return res
        .status(409)
        .json({ message: `coupon ${req.params.name} already exists` });
    }
    coupon.name = req.body.name;
  }
  if (req.body.amount) {
    coupon.amount = req.body.amount;
  }
  await coupon.save();
  return res.status(200).json({ message: "success", coupon });
};

export const softDelete = async (req, res) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!coupon) {
    return res.status(400).json({ message: "con't delete this coupon!" });
  }
  return res.status(200).json({ message: "success", coupon });
};

export const restore = async (req, res) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndUpdate(
    { _id: id, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );
  if (!coupon) {
    return res.status(400).json({ message: "con't restore this coupon!" });
  }
  return res.status(200).json({ message: "success", coupon });
};

export const hardDelete = async (req, res) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndDelete({ _id: id });
  if (!coupon) {
    return res.status(400).json({ message: "con't delete this coupon!" });
  }
  return res.status(200).json({ message: "success", coupon });
};
