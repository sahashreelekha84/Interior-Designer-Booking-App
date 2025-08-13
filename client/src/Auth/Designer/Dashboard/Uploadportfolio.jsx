import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Grid,
} from '@mui/material';
import Designersideber from './sideber';

const categories = [
  { value: 'Interior', label: 'Interior' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Paint', label: 'Paint' },
];

const Uploadportfolio = () => {
  const des_id = localStorage.getItem('des_id'); // get designerId from localStorage

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Preview generation
  useEffect(() => {
    if (images.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach(URL.revokeObjectURL);
      setPreviews([]);
    };
  }, [images]);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    if (!des_id) return setError('Designer ID not found in localStorage');
    if (!title.trim()) return setError('Please enter a title');
    if (!category) return setError('Please select a category');
    if (images.length === 0) return setError('Please select at least one image');

    const formData = new FormData();
    formData.append('designerId', des_id);
    formData.append('title', title.trim());
    formData.append('category', category);
    images.forEach((img) => formData.append('images', img));

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3005/api/uploadPortfolio', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload portfolio');
      }
      await res.json();
      setSuccess(true);
      // Reset form
      setTitle('');
      setCategory('');
      setImages([]);
      setInputKey(Date.now());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex">
      <Designersideber />
      <Box p={4} flexGrow={1} sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Upload Portfolio Item
          </Typography>

          {/* Show logged-in designerId
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Designer ID: <strong>{des_id}</strong>
          </Typography> */}

          {/* Alerts */}
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" mb={2}>
              Portfolio uploaded successfully!
            </Typography>
          )}

          {/* Title input */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          {/* Category select */}
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          {/* File input */}
          <input
            key={inputKey}
            type="file"
            accept="image/*"
            multiple
            id="portfolio-images"
            onChange={(e) => setImages(Array.from(e.target.files))}
            style={{ display: 'none' }}
            disabled={loading}
          />
          <label htmlFor="portfolio-images">
            <Button
              variant="outlined"
              component="span"
              sx={{ mt: 2, mb: 1 }}
              fullWidth
              disabled={loading}
            >
              {images.length > 0
                ? `${images.length} image(s) selected`
                : 'Select Images'}
            </Button>
          </label>

          {/* Preview thumbnails */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {previews.map((src, idx) => (
              <Grid item key={idx}>
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Upload button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Uploadportfolio;
