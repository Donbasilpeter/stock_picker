import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Schema for DataInterfaceNormalisedStock
const dataInterfaceNormalisedStockSchema = new Schema({
  dttm: {
    type: Date,
    required: true
  },
  dailyChange: {
    type: Number,
    required: true
  }
});

// Schema for NormalisedDataInterfaceNormalisedStock
const normalisedDataInterfaceNormalisedStockSchema = new Schema({
  dttm: {
    type: Date,
    required: true
  },
  normalisedData: {
    type: Number,
    required: true
  }
});

// Main NormalisedStock schema
const normalisedStockSchema = new Schema({
  Scripname: {
    type: String,
    required: true,
    unique: true
  },
  scripcode: {
    type: Number,
    required: true,
    unique: true
  },
  dailyMean: {
    type: Number,
    required: true
  },
  dailyStandardDeviation: {
    type: Number,
    required: true
  },
  cagr: {
    type: Number,
    required: true
  },
  NormalisedDailyMean: {
    type: Number,
    required: true
  },
  NormalisedDailyStandardDeviation: {
    type: Number,
    required: true
  },
  Data: {
    type: [dataInterfaceNormalisedStockSchema], // Referencing the schema for DataInterfaceNormalisedStock
    required: true
  },
  normalisedData: {
    type: [normalisedDataInterfaceNormalisedStockSchema], // Referencing the schema for NormalisedDataInterfaceNormalisedStock
    required: true
  }
});

// Create model from the schema
const NormalisedStock = model('NormalisedStock', normalisedStockSchema);

export default NormalisedStock;
