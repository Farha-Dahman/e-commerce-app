import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../services/cloudinary.js";

export const createSubcategory = async (req, res) => {
  const { name, CategoryId } = req.body;
  const subcategory = await subcategoryModel.findOne({ name });
  if (subcategory) {
    return res
      .status(409)
      .json({ message: `subcategory ${name} already exist` });
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

export const getSubcategory = async (req,res)=>{
    const CategoryId = req.params.id;
    const category = await categoryModel.findById(CategoryId);
    if(!category){
        return res.status(404).json({message:"category not found!"});
    }
    const subcategories = await subcategoryModel.find({CategoryId}).populate({
        path: 'CategoryId'
    });
    return res.status(200).json({message:"success",subcategories});
}
