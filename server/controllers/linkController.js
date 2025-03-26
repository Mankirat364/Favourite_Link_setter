import linkModel from "../models/links.js";
import userModel from '../models/user.js'

export const createLink = async (req, res) => {
    try {
        console.log("Received Data in Backend:", req.body); 
        console.log("Received Data in Backend:", req.body); 
        const { title, url, description, tags } = req.body;
        if (!req.user?.userId) {
            return res.status(400).json({ message: "User ID is missing from request" });
        }   
        if (!title || !url) {
            return res.status(400).json({ message: "Title and URL are required" });
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({ message: "Tags must be an array" });
        }

        const newLink = await linkModel.create({
            title,
            url,
            description,
            tags,
            userId: req.user.userId,
        });

        res.status(200).json({
            message: "Link Created Successfully",
            newLink,
        });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Error Creating the link" });
    }
};


export const getLink = async(req,res)=>{
    try {
        if (!req.user?.userId) {
            return res.status(400).json({ message: "User ID missing from request" });
        }

        const links = await linkModel.find({userId : req.user.userId}).populate("userId", "username email");

        
        res.status(200).json({
            message : "notes fetched successfully",
            links,
        })
    } catch (error) {
        res.status(500).json({
            message : "error fetching the notes"
        })
    }
}
export const updateLink = async(req,res) =>{
    try {
        const {title,url,description,tags,link_id} = req.body;
        if (!req.user?.userId) {
            return res.status(400).json({ message: "User ID missing from request" });
        }
        if(!link_id){
            return res.status(400).json({
                message : "link id is missing"
            })
        }
        const links = await linkModel.findById({userId : req.user.userId, _id : link_id})
        if(!links){
            res.status(400).json({
                message : "link not found!"
            })
        }
        const updatedFields = {}
        if(title) updatedFields.title = title;
        if(url) updatedFields.url = url
        if(description) updatedFields.description = description
        if(tags) updatedFields.tags = tags

        const updatedLink = await linkModel.findByIdAndUpdate(
            {

            userId : req.user.userId,
            _id : link_id,
        },
        {$set : updatedFields},
        { new: true, runValidators: true }
        );
        return res.status(201).json({
            message : "Link Updated Successfully"
        })
    } catch (error) {
        
    }
}
export const deleteLink = async (req, res) => {
    try {
        const link_id = req.params.link_id; 

        if (!req.user?.userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!link_id) {
            return res.status(400).json({ message: "Link ID is missing" });
        }

        const deletedLink = await linkModel.findOneAndDelete({
            _id: link_id,
            userId: req.user.userId,
        });

        if (!deletedLink) {
            return res.status(404).json({ message: "Link not found" });
        }

        res.status(200).json({ message: "Link successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
export const getAllLink = async(req,res) =>{
    try {
        const BrowseLink = await linkModel.find().populate("userId", "username email");
        if(!BrowseLink){
           return res.status(400).json({
                message : "links doesnot exist"
            })
        }
        res.status(200).json({
            message : "links fetched successfully",
            BrowseLink,
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })    
    }
}