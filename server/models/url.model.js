const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectURL: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  analytics: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      ip: String,
      userAgent: String,
      referrer: String,
      location: {
        country: String,
        city: String,
        // add other location fields as needed
      },
    },
  ],
  // ... other fields ...
});
