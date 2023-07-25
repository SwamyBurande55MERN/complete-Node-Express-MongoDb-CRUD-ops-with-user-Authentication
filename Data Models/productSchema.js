import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
      bookName: {
            type: String,
            required: true
      },
      author: {
            type: String,
            required: true
      },
      publishDate: {
            type: Date,   // yyyy-mm-dd
            required: true
      },
      mrp: {
            type: Number,
            required: true
      },
      bookType: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      }
})

const BOOK = new mongoose.model("BookData", productSchema);
export default BOOK;