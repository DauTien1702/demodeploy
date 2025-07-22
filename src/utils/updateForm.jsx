import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { Image } from "antd";

export const InfoRow = ({ icon, label, value, isImage = false }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      py: 1.5,
      borderBottom: "1px solid #eee",
      gap: 2,
      px: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>{icon}</Box>
    <Box sx={{ width: 150, color: "#555", fontWeight: 500, mb: 1.5 }}>
      {label}
    </Box>
    <Box sx={{ flex: 1 }}>
      {isImage ? (
        <Image
          src={value}
          alt={label}
          width={120}
          height={120}
          style={{ borderRadius: 8, objectFit: "cover" }}
          preview={{
            zIndex: 2000,
          }}
        />
      ) : (
        <Typography sx={{ whiteSpace: "pre-line" }}>{value}</Typography>
      )}
    </Box>
  </Box>
);

export const InputRow = ({
  icon,
  label,
  name,
  value,
  onChange,
  error,
  helperText,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      py: 1.5,
      borderBottom: "1px solid #eee",
      gap: 2,
      px: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>{icon}</Box>
    <Box sx={{ width: 150, color: "#555", fontWeight: 500, mb: 1.5 }}>
      {label}
    </Box>
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      size="small"
      fullWidth
      sx={{ mb: 1.5 }}
      error={error}
      helperText={helperText}
    />
  </Box>
);

export const InputSelectRow = ({
  icon,
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      py: 1.5,
      borderBottom: "1px solid #eee",
      gap: 2,
      px: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>{icon}</Box>
    <Box sx={{ width: 150, color: "#555", fontWeight: 500, mb: 1.5 }}>
      {label}
    </Box>
    <TextField
      name={name}
      select
      size="small"
      fullWidth
      value={value}
      onChange={onChange}
      sx={{ mb: 1.5 }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

export const InputImageRow = ({ label, imageUrl, onUpload }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      py: 1.5,
      borderBottom: "1px solid #eee",
      gap: 2,
      px: 2,
    }}
  >
    <Box sx={{ width: 150, color: "#555", fontWeight: 500, mb: 1.5 }}>
      {label}
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={label}
          width={120}
          height={120}
          style={{ borderRadius: 8, objectFit: "cover" }}
          preview={{
            zIndex: 2000,
          }}
        />
      )}

      <Button variant="outlined" component="label" size="small">
        Chọn ảnh mới
        <input type="file" accept="image/*" hidden onChange={onUpload} />
      </Button>
    </Box>
  </Box>
);
