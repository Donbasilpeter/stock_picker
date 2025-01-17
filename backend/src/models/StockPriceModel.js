import mongoose from 'mongoose';

// Define the Data Schema
const DataSchema = new mongoose.Schema(
  {
    dttm: { type: Date, required: true },
    vale1: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value !== 0; // Ensure vale1 is not 0
        },
        message: 'vale1 cannot be 0',
      },
    },
    vole: { type: Number, required: true },
  },
  { _id: false } // Prevents creation of unique _id for each sub-document
);

// Define the StockPrice Schema
const StockPriceSchema = new mongoose.Schema(
  {
    CurrDate: { type: Date, required: true },
    PrevClose: { type: Number, required: true },
    LowVal: { type: Number, required: true },
    HighVal: { type: Number, required: true },
    Scripname: { type: String, unique: true, required: true },
    CurrVal: { type: Number, required: true },
    CurrTime: { type: String, required: true },
    LowVol: { type: Number, required: true },
    HighVol: { type: Number, required: true },
    scripcode: { type: Number, unique: true, required: true },
    Data: { type: [DataSchema], required: true }, // Array of Data objects
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the StockPrice model
const StockPrice = mongoose.model('StockPrice', StockPriceSchema);

export default StockPrice;
