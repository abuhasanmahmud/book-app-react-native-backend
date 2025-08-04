import express from "express";

import protectRoute from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// ✅ Create a new book
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //upload the image to cloudinary
    // const uploadResponse = await cloudinary.uploader.upload(image);
    // const imageUrl = uploadResponse.secure_url;
    const imageUrl =
      "https://res.cloudinary.com/dmadhbgty/image/upload/v1709301234/grostore/placeholder.png";

    const book = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all books
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      books,
    });
  } catch (error) {
    console.error("Error fetching user books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a book
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the logged-in user is the owner of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this book" });
    }

    // Optionally, delete the image from cloudinary if you are storing images
    if (book.image && book.image.cllude("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
      }
    }

    await book.deleteOne(); // Use deleteOne directly on the document
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a book
router.put("/:id", async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, caption, image, rating },
      { new: true, runValidators: true }
    );

    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
