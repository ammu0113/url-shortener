import { useState } from "react";
import { Paper, TextField, Button, Box, Link, IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { urls } from "../services/api";
import toast from "react-hot-toast";

const UrlShortener = ({ onSuccess }) => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await urls.create({ originalUrl: url, customAlias });
      const fullUrl = `${window.location.origin}/api/url/${data.shortId}`;
      setShortenedUrl(fullUrl);
      if (onSuccess) onSuccess(data);
      toast.success("URL shortened successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to shorten URL");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter your long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Custom Alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Shorten URL
        </Button>
      </form>

      {shortenedUrl && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link href={shortenedUrl} target="_blank" sx={{ flexGrow: 1 }}>
              {shortenedUrl}
            </Link>
            <IconButton onClick={copyToClipboard} size="small">
              <ContentCopy />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default UrlShortener;
