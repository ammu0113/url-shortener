import { Box, Paper, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = ({ url }) => {
  if (!url) return null;

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        QR Code
      </Typography>
      <Box sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}>
        <QRCodeSVG value={url} size={128} />
      </Box>
    </Paper>
  );
};

export default QRCodeGenerator;
