import React from "react";
import "./UrlStats.scss";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  Timeline,
  Language,
  DevicesOther,
  TrendingUp,
} from "@mui/icons-material";

const StatCard = ({ title, value, icon }) => (
  <Paper sx={{ p: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {icon}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
    </Box>
  </Paper>
);

const UrlStats = ({ analytics }) => {
  if (!analytics) {
    return <div className="stats-loading">No analytics data available</div>;
  }

  const totalClicks = analytics.totalClicks || 0;
  const clickData = analytics.analytics || [];

  const uniqueVisitors = new Set(clickData.map((a) => a.ip)).size;
  const browsers = clickData.reduce((acc, curr) => {
    const browser = curr.userAgent?.split(" ")[0] || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});
  const topBrowser =
    Object.entries(browsers).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

  return (
    <div className="url-stats">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clicks"
            value={totalClicks}
            icon={<TrendingUp color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unique Visitors"
            value={uniqueVisitors}
            icon={<Timeline color="secondary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Top Browser"
            value={topBrowser}
            icon={<Language color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Last 24h Clicks"
            value={
              clickData.filter(
                (a) => new Date(a.timestamp) > new Date(Date.now() - 86400000)
              ).length
            }
            icon={<DevicesOther color="info" />}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Click History
        </Typography>
        <Paper sx={{ p: 2 }}>
          {clickData.length > 0 ? (
            clickData.map((click, index) => (
              <Box
                key={index}
                sx={{
                  py: 1,
                  borderBottom: index < clickData.length - 1 ? 1 : 0,
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2">
                  Clicked at: {new Date(click.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Browser: {click.browser || "Unknown"}
                </Typography>
                <Typography variant="body2">
                  Platform: {click.platform || "Unknown"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No click history available</Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default UrlStats;
