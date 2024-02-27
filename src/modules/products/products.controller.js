import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import productModel from "../../../DB/model/product.model.js";
import cloudinary from "../../services/cloudinary.js";

export const getProducts = async (req, res) => {
  const products = await productModel.find({});
  return res.status(200).json({ message: "success", products });
};

export const createProduct = async (req, res, next) => {
  const {
    name,
    price,
    discount,
    category,
    subcategory,
    description,
    color,
    size,
  } = req.body;
  const checkCategory = await categoryModel.findById(category);
  if (!checkCategory) {
    return next(new Error("Category not found", { cause: 404 }));
  }
  const checkSubCategory = await subcategoryModel.findById(subcategory);
  if (!checkSubCategory) {
    return next(new Error("Subcategory not found", { cause: 404 }));
  }
  if (await productModel.findOne({ name })) {
    return next(new Error("Product name already exist!", { cause: 409 }));
  }
  req.body.slug = slugify(name);
  req.body.finalPrice = (price - (price * (discount || 0)) / 100).toFixed(2);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/${req.body.name}/mainImages` }
  );
  req.body.mainImage = { secure_url, public_id };
  req.body.subImages = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` }
    );
    req.body.subImages.push({ secure_url, public_id });
  }
  if (req.body.description) {
    req.body.description = description;
  }
  if (size && !["S", "M", "Lg", "XL"].includes(size)) {
    return next(new Error("Invalid size value", { cause: 400 }));
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error("Error while creating product!", { cause: 400 }));
  }
  return res.status(201).json({ message: "succuss", product });
};

export const getSpecificProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);
  return res.status(200).json({ message: "success", product });
};

export const updateProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new Error("This product is not found!", { cause: 404 }));
  }
  if (req.body.name) {
    if (await productModel.findOne({ name: req.body.name }).select("name")) {
      return next(
        new Error("Product with this name already exists!", { cause: 409 })
      );
    }
    product.name = req.body.name;
    product.slug = slugify(req.body.name);
  }
  if (req.body.status) {
    product.status = req.body.status;
  }
  if (req.body.description) {
    product.description = req.body.description;
  }
  if (req.body.stock) {
    product.stock = req.body.stock;
  }
  if (req.body.color) {
    product.color = req.body.color;
  }
  if (req.body.size) {
    product.size = req.body.size;
  }

  if (req.body.price !== undefined) {
    product.price = req.body.price;
    if (req.body.discount !== undefined) {
      const discount = parseFloat(req.body.discount);
      if (!isNaN(discount) && discount >= 0) {
        product.finalPrice = (
          product.price -
          product.price * (discount / 100)
        ).toFixed(2);
      }
    }
  }
  if (req.body.discount !== undefined) {
    product.discount = req.body.discount;
    if (product.discount > 0) {
      product.finalPrice =
        product.price - ((product.price * product.discount) / 100).toFixed(2);
    } else {
      product.finalPrice = product.price;
    }
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/products`,
      }
    );
    await cloudinary.uploader.destroy(product.image.public_id);
    product.mainImage = { public_id, secure_url };
  }
  product.updatedBy = req.user._id;
  await product.save();
  return res.status(200).json({ message: "success", product });
};

export const softDelete = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!product) {
    return next(new Error("Con't delete this product!", { cause: 400 }));
  }
  return res.status(200).json({ message: "success", product });
};

export const restore = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndUpdate(
    { _id: id, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );
  if (!product) {
    return next(new Error("Con't restore this product!", { cause: 400 }));
  }
  return res.status(200).json({ message: "success", product });
};

export const hardDelete = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete({ _id: id });
  if (!product) {
    return next(new Error("Con't delete this product!", { cause: 400 }));
  }
  return res.status(200).json({ message: "success", product });
};

export const changeStatus = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  const newStatus = product.status === "Active" ? "Inactive" : "Active";
  product.status = newStatus;

  const updatedProduct = await product.save();
  return res.status(200).json({ message: "success", product: updatedProduct });
};
