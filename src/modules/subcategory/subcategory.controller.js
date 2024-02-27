import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../services/cloudinary.js";

export const createSubcategory = async (req, res, next) => {
  const { name, CategoryId } = req.body;
  const subcategory = await subcategoryModel.findOne({ name });
  if (subcategory) {
    return next(
      new Error(`subcategory ${name} already exist!`, { cause: 409 })
    );
  }
  const category = await categoryModel.findById(CategoryId);
  if (!category) {
    return res.status(404).json({ message: "category not found!" });
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/subcategories`,
    }
  );
  const subCategory = await subcategoryModel.create({
    name,
    slug: slugify(name),
    CategoryId,
    image: { public_id, secure_url },
  });
  return res.status(201).json({ message: "succuss", subCategory });
};

export const getSubcategories = async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new Error("category not found!", { cause: 404 }));
  }
  const subcategories = await subcategoryModel
    .find({ CategoryId: id })
    .populate({
      path: "CategoryId",
    });
  return res.status(200).json({ message: "success", subcategories });
};

export const getSpecificSubcategory = async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await subcategoryModel.findById(id);
  if (!subcategory) {
    return next(new Error("subcategory not found!", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", subcategory });
};

export const getActiveSubcategories = async (req, res) => {
  const activeSubcategories = await subcategoryModel
    .find({ status: "Active" })
    .select("name image");
  return res.status(200).json({ message: "success", activeSubcategories });
};

export const updateSubcategory = async (req, res, next) => {
  const subcategory = await subcategoryModel.findById(req.params.id);
  if (!subcategory) {
    return next(new Error("This subcategory is not found!", { cause: 404 }));
  }
  if (req.body.name) {
    if (
      await subcategoryModel.findOne({ name: req.body.name }).select("name")
    ) {
      return next(new Error("This subcategory already exist!", { cause: 409 }));
    }
    subcategory.name = req.body.name;
    subcategory.slug = slugify(req.body.name);
  }
  if (req.body.status) {
    subcategory.status = req.body.status;
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/subcategories`,
      }
    );
    await cloudinary.uploader.destroy(subcategory.image.public_id);
    subcategory.image = { public_id, secure_url };
  }
  subcategory.updatedBy = req.user._id;
  await subcategory.save();
  return res.status(200).json({ message: "success", subcategory });
};

export const deleteSubcategory = async (req, res, next) => {
  const { id } = req.params;
  const deletedSubcategory = await subcategoryModel.findByIdAndDelete(id);

  if (!deletedSubcategory) {
    return next(new Error("subcategory not found!", { cause: 404 }));
  }
  return res
    .status(200)
    .json({ message: "success", deletedSubcategory });
};
