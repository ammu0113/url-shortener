import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
  Alert,
  Modal,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  IconButton,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { urls } from "../services/api";
import toast from "react-hot-toast";
import UrlList from "../components/UrlList";
import UrlStats from "../components/UrlStats";
import QRCodeGenerator from "../components/QRCodeGenerator";
import UrlShortener from "../components/UrlShortener";
import {
  showConfirmDialog,
  showSuccessAlert,
  showErrorAlert,
} from "../utils/swal";
import { BarChart, Delete } from "@mui/icons-material";

const Dashboard = () => {
  const [selectedUrl, setSelectedUrl] = useState(null);
  console.log("props selectedUrl", selectedUrl);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: urlsData, isLoading } = useQuery({
    queryKey: ["urls"],
    queryFn: async () => {
      const response = await urls.getAll();
      return response.data;
    },
  });

  // Analytics query
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", selectedUrl?.shortId],
    queryFn: async () => {
      if (!selectedUrl?.shortId) return null;
      const response = await urls.getAnalytics(selectedUrl.shortId);
      return response.data;
    },
    enabled: Boolean(selectedUrl?.shortId) && open,
    staleTime: 30000,
    cacheTime: 3600000,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
    onError: (error) => {
      console.error("Analytics fetch error:", error);
      if (error.response?.status === 404) {
        // Handle 404 specifically
        toast.error("Analytics data not found for this URL");
      } else {
        toast.error("Failed to fetch analytics data");
      }
      setOpen(false);
    },
  });

  // Delete URL mutation
  const deleteMutation = useMutation({
    mutationFn: (shortId) => urls.delete(shortId),
    onSuccess: () => {
      queryClient.invalidateQueries(["urls"]);
      showSuccessAlert({
        text: "URL has been deleted successfully",
      });
    },
    onError: (error) => {
      showErrorAlert({
        text: error.message || "Failed to delete URL",
      });
    },
  });

  const handleDelete = async (url) => {
    const result = await showConfirmDialog({
      title: "Delete URL?",
      text: `Are you sure you want to delete ${url.shortId}?`,
      icon: "warning",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(url.shortId);
    }
  };

  const handleViewAnalytics = useCallback((url) => {
    setSelectedUrl(url);
    setOpen(true);
  }, []);

  const handleViewQR = (url) => {
    setSelectedUrl(url);
    setQrDialogOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleUrlCreated = () => {
    queryClient.invalidateQueries(["urls"]);
    toast.success("URL created successfully");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (urlsData?.urls && urlsData.urls.length === 0) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info">
          No URLs found. Create your first shortened URL above!
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              URL Dashboard
            </Typography>
          </Grid>

          {/* URL Shortener Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create New Short URL
              </Typography>
              <UrlShortener onSuccess={handleUrlCreated} />
            </Paper>
          </Grid>

          {/* URL List Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your URLs
              </Typography>
              {urlsData?.urls && urlsData.urls.length > 0 ? (
                <UrlList
                  urls={urlsData.urls}
                  onDelete={handleDelete}
                  onViewAnalytics={handleViewAnalytics}
                  onViewQR={handleViewQR}
                />
              ) : (
                <Alert severity="info">
                  No URLs found. Create your first shortened URL above!
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Analytics Section */}
          {selectedUrl && (
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: {
                    xs: "90%", // For extra-small devices
                    sm: "80%", // For small devices
                    md: "70%", // For medium devices
                    lg: "60%", // For large devices
                    xl: "50%", // For extra-large devices
                  },
                  maxWidth: "800px",
                  maxHeight: "90vh",
                  overflow: "auto",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 24,
                }}
              >
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      mb: 3,
                      pb: 2,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    Analytics for {selectedUrl.shortId}
                  </Typography>

                  <Button
                    onClick={handleClose}
                    sx={{
                      position: "absolute",
                      right: { xs: 8, sm: 16 },
                      top: { xs: 8, sm: 16 },
                    }}
                  >
                    Close
                  </Button>

                  {analyticsLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 3,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      <UrlStats
                        analytics={analytics}
                        shortId={selectedUrl.shortId}
                      />
                    </Box>
                  )}
                </Paper>
              </Box>
            </Modal>
          )}
        </Grid>
      </Box>

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>QR Code for {selectedUrl?.shortId}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <QRCodeGenerator url={selectedUrl?.shortUrl} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
