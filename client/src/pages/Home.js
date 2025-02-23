import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  CircularProgress,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { urls } from "../services/api";
import toast from "react-hot-toast";

const Home = () => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await urls.create({
        originalUrl: url,
        customAlias: customAlias || undefined,
      });
      const fullUrl = `${window.location.origin}/api/url/${data.shortId}`;
      setShortenedUrl(fullUrl);
      toast.success("URL shortened successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Make your long URLs short and trackable
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter your long URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Custom Alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              margin="normal"
              helperText="Leave blank for auto-generated short URL"
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Shorten URL"}
            </Button>
          </form>

          {shortenedUrl && (
            <Box sx={{ mt: 4 }}>
              <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Link
                    href={shortenedUrl}
                    target="_blank"
                    sx={{
                      flexGrow: 1,
                      wordBreak: "break-all",
                    }}
                  >
                    {shortenedUrl}
                  </Link>
                  <Button
                    startIcon={<ContentCopy />}
                    onClick={copyToClipboard}
                    variant="outlined"
                  >
                    Copy
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
