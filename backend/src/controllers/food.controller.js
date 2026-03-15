const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No video files provided" });
    }

    const createdFoods = [];

    for (const file of req.files) {
        const fileUploadResult = await storageService.uploadFile(file.buffer, uuid());
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        });
        createdFoods.push(foodItem);
    }

    res.status(201).json({
        message: `${createdFoods.length} food items created successfully`,
        foods: createdFoods
    });
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel
        .find({})
        .sort({ createdAt: -1 })
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}

async function deleteFood(req, res) {
    const foodId = req.params.id;
    const partner = req.foodPartner;

    const food = await foodModel.findOneAndDelete({
        _id: foodId,
        foodPartner: partner._id
    });

    if (!food) {
        return res.status(404).json({
            message: "Food item not found or not owned by you"
        });
    }

    // Clean up likes & saves for this food so counts stay correct on future items
    await likeModel.deleteMany({ food: foodId });
    await saveModel.deleteMany({ food: foodId });

    return res.status(200).json({
        message: "Food item deleted successfully"
    });
}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    deleteFood
}