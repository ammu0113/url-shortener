const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const geoip = require("geoip-lite");

const urlController = {
  // Create short URL
  createShortUrl: async (req, res) => {
    try {
      const { originalUrl, customAlias } = req.body;
      const user = req.user;

      // Validate URL
      if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      // Generate or use custom shortId
      const shortId = customAlias || nanoid(8);

      // Check if custom alias is already taken
      if (customAlias) {
        const existingUrl = await Url.findOne({ shortId: customAlias });
        if (existingUrl) {
          return res
            .status(400)
            .json({ message: "Custom alias already in use" });
        }
      }

      const url = new Url({
        originalUrl,
        shortId,
        user: user._id,
      });

      await url.save();

      // Construct the full shortened URL
      const shortUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/url/${shortId}`;

      res.status(201).json({
        shortId: url.shortId,
        originalUrl: url.originalUrl,
        shortUrl: shortUrl,
        createdAt: url.createdAt,
        isActive: true,
        clicks: 0,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Redirect to URL
  redirectToUrl: async (req, res) => {
    try {
      const { shortId } = req.params;
      const url = await Url.findOne({ shortId });

      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }

      // Check if URL has expired
      if (url.expiresAt && url.expiresAt < new Date()) {
        return res.status(410).json({ message: "URL has expired" });
      }

      // Record analytics
      const analytics = {
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers.referer || "",
        location: geoip.lookup(req.ip) || {},
      };

      url.clicks += 1;
      url.analytics.push(analytics);
      await url.save();

      // Use 302 Found for temporary redirect
      return res.redirect(302, url.originalUrl);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all URLs for a user
  getAllUrls: async (req, res) => {
    try {
      const urls = await Url.find({ user: req.user._id });

      const urlList = urls.map((url) => ({
        shortId: url.shortId,
        originalUrl: url.originalUrl,
        shortUrl: `${req.protocol}://${req.get("host")}/api/url/${url.shortId}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        isActive: url.isActive,
      }));

      res.json({
        urls: urlList,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get analytics for a URL
  getAnalytics: async (req, res) => {
    try {
      const { shortId } = req.params;

      console.log("Fetching analytics for shortId:", shortId); // Debug log

      // Verify shortId exists
      if (!shortId) {
        console.log("No shortId provided");
        return res.status(400).json({ message: "Short ID is required" });
      }

      // Find the URL and populate analytics
      const url = await Url.findOne({ shortId });

      console.log("URL found:", !!url); // Debug log

      if (!url) {
        console.log("URL not found for shortId:", shortId);
        return res.status(404).json({ message: "URL not found" });
      }

      // Prepare analytics data
      const analyticsData = {
        totalClicks: url.clicks || 0,
        analytics: url.analytics || [],
        shortId: url.shortId,
        originalUrl: url.originalUrl,
      };

      console.log("Returning analytics data"); // Debug log
      return res.json(analyticsData);
    } catch (error) {
      console.error("Analytics error:", error);
      return res.status(500).json({
        message: "Error fetching analytics",
        error: error.message,
      });
    }
  },

  toggleUrlStatus: async (req, res) => {
    try {
      const { shortId } = req.params;
      const url = await Url.findOne({ shortId, user: req.user._id });

      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }

      url.isActive = !url.isActive;
      await url.save();

      res.json({
        message: `URL ${
          url.isActive ? "activated" : "deactivated"
        } successfully`,
        isActive: url.isActive,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = urlController;
