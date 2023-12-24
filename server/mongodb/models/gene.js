import mongoose from "mongoose";

const GeneSchema = new mongoose.Schema(
  {
    gene: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      required: true,
    },
    exper_rep1: {
      type: Number,
      required: true,
    },
    exper_rep2: {
      type: Number,
      required: true,
    },
    exper_rep3: {
      type: Number,
      required: true,
    },
    control_rep1: {
      type: Number,
      required: true,
    },
    control_rep2: {
      type: Number,
      required: true,
    },
    control_rep3: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Gene = mongoose.model("Gene", GeneSchema);

export default Gene;
