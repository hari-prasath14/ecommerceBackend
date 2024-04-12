import Category from "../Models/category.schema.js";
import slugify from "slugify";

export const createCategory =async(req,res)=>{
    try{
        const {name} = req.body

        if(!name){
            return res.status(401).send({success:false,message:"Enter Category Name"})
        }
        const existingCategory = await Category.findOne({name})

        if(existingCategory){

            return res.status(200).send({
                success:false,
                message:"Category already Exist"})
        }
        const newCategory = new Category({name,slug:slugify(name)})

        newCategory.save()

        res.status(201).send({success:true,message:"New Category Created",newCategory})

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"Error in Category"
        })
    }
}


export const updateCategory = async(req,res) =>{

    try{
        const {name} = req.body
        const {id} = req.params
        
        const existingCategory = await Category.findOne({name})

        if(existingCategory){

            return res.status(200).send({
                success:false,
                message:"Category already Exist"})
        }
        const updatedCategory = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({success:true,message:"Updated Successfully",updatedCategory})
    }
    catch(err){
        res.status(500).send({success: false,message:"Error while updating category"})
    }

}

export const getAllCategory = async(req,res)=>{
    
    try{
        const allCategory = await Category.find()
        res.status(200).send({success:true,allCategory})

    }

    catch(err){
        res.status(500).send({success:false,message:"Error while getting all categories"})
    }
}

export const singleCategory =async(req,res)=>{

    try {
        const {slug} = req.params
        // console.log(id);
        const oneCategory = await Category.findOne({slug:slug})
        if (oneCategory) {
        res.status(200).send({success:true,oneCategory})           
        }
        else{
            res.status(200).send({success: false, message:"There is no such category"})
        }
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({success:false,message:"Error while getting single categories",error})        
    }
}

export const deleteCategory = async(req,res) =>{
    try {
        const {id} = req.params
        console.log( await Category.findByIdAndDelete({_id:id}))
        res.status(200).send({success:true,message:"Deleted successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,message:"Error while dleting category"})
    }
}