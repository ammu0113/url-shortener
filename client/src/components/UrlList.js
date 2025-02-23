import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Link,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ContentCopy,
  MoreVert,
  QrCode,
  Analytics,
  Delete,
} from "@mui/icons-material";
import toast from "react-hot-toast";

const UrlList = ({ urls, onDelete, onViewAnalytics, onViewQR }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const handleMenuOpen = (event, url) => {
    setAnchorEl(event.currentTarget);
    setSelectedUrl(url);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUrl(null);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Created</TableCell>
            {/* <TableCell>Status</TableCell> */}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((url) => (
            <TableRow key={url.shortId}>
              <TableCell>
                <Link href={url.shortUrl} target="_blank">
                  {url.shortId}
                </Link>
              </TableCell>
              <TableCell>
                <Tooltip title={url.originalUrl}>
                  <span>{url.originalUrl.substring(0, 50)}...</span>
                </Tooltip>
              </TableCell>
              <TableCell>{url.clicks}</TableCell>
              <TableCell>{formatDate(url.createdAt)}</TableCell>
              {/* <TableCell>
                <Chip
                  label={url.isActive ? "Active" : "Inactive"}
                  color={url.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell> */}
              <TableCell>
                <IconButton onClick={() => copyToClipboard(url.shortUrl)}>
                  <ContentCopy fontSize="small" />
                </IconButton>
                <IconButton onClick={(e) => handleMenuOpen(e, url)}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            onViewAnalytics(selectedUrl);
            handleMenuClose();
          }}
        >
          <Analytics sx={{ mr: 1 }} fontSize="small" />
          View Analytics
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewQR(selectedUrl);
            handleMenuClose();
          }}
        >
          <QrCode sx={{ mr: 1 }} fontSize="small" />
          Show QR Code
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(selectedUrl);
            handleMenuClose();
          }}
        >
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete URL
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default UrlList;
