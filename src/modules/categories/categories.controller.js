import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../services/cloudinary.js";

export const getCategories = async (req, res) => {
  const categories = await categoryModel.find().populate("subcategory");
  return res.status(200).json({ message: "success", categories });
};

export const getSpecificCategories = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  return res.status(200).json({ message: "success", category });
};

export const createCategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name })) {
    return next(new Error("category name already exist!", { cause: 409 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/categories`,
    }
  );
  const newCategory = await categoryModel.create({
    name,
    slug: slugify(name),
    image: { public_id, secure_url },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  return res.status(201).json({ message: "success", newCategory });
};

export const getActiveCategories = async (req, res) => {
  const activeCategories = await categoryModel
    .find({ status: "Active" })
    .select("name image");
  return res.status(200).json({ message: "success", activeCategories });
};

export const updateCategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(new Error("This category is not found!", { cause: 404 }));
  }
  if (req.body.name) {
    if (await categoryModel.findOne({ name: req.body.name }).select("name")) {
      return next(new Error("This category already exist!", { cause: 409 }));
    }
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }
  if (req.body.status) {
    category.status = req.body.status;
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/categories`,
      }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { public_id, secure_url };
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res.status(200).json({ message: "success", category });
};
