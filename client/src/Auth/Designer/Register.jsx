import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Avatar,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Chip,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Home and Preference Options
const homeTypes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Duplex', 'Villa'];
const budgets = ['₹2L - ₹5L', '₹5L - ₹10L', '₹10L - ₹15L', '₹15L - ₹20L'];
const kitchenPrefs = ['Granite', 'Drawer', 'Block', 'Modular', 'Backsplash'];
const livingroomPrefs = ['TvUnit', 'Sofa', 'CoffeeTable', 'Bookshelf', 'AccentWall'];
const bedroomPrefs = ['Wardrobe', 'Bed', 'SideTable', 'Mirror', 'AccentLighting'];

// API function
const registerDesigner = async (formData) => {
  const response = await axios.post('http://localhost:3005/api/register/designer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const DesignerRegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: '',
    style: '',
    image: null,
    decoration_budget: {
      homeType: [],
      budget: [],
      preferences: {
        kitchen: [],
        livingroom: [],
        bedroom: [],
      },
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

  const mutation = useMutation({
    mutationFn: registerDesigner,
    onSuccess: (data) => {
  
          Swal.fire({
                 icon: 'success',
                 title: 'Success',
                 text: data?.message || ' Designer Register successfully updated!',
                 confirmButtonColor: '#3085d6',
               })
      navigate('/designer_login');
    },
    onError: (err) => {
  Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: err?.response?.data?.message || 'Something went wrong',
              confirmButtonColor: '#d33',
            })}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBudgetChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      decoration_budget: {
        ...prev.decoration_budget,
        [field]: value,
      },
    }));
  };

  const handlePreferencesChange = (room, value) => {
    setForm((prev) => ({
      ...prev,
      decoration_budget: {
        ...prev.decoration_budget,
        preferences: {
          ...prev.decoration_budget.preferences,
          [room]: value,
        },
      },
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const errors = [];

  // Name validation
  if (!form.designername?.trim()) {
    errors.push('Full Name is required');
  } else if (!/^[A-Za-z\s]{2,}$/.test(form.designername)) {
    errors.push('Full Name must contain only letters and spaces');
  }

  // Email validation
  if (!form.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!form.password) {
    errors.push('Password is required');
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)
  ) {
    errors.push(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
    );
  }

  // Optional: Style URL validation (if filled)
 

  // Optional: Location and bio can be skipped or validated if required

  // Image validation
  if (!form.image) {
    errors.push('Profile image is required');
  }

  // Home type and budget validation
  if (form.decoration_budget.homeType.length === 0) {
    errors.push('At least one Home Type must be selected');
  }

  if (form.decoration_budget.budget.length === 0) {
    errors.push('At least one Budget Range must be selected');
  }

  // Preferences validation (optional but can be enforced)
  const prefs = form.decoration_budget.preferences;
  if (
    prefs.kitchen.length === 0 &&
    prefs.livingroom.length === 0 &&
    prefs.bedroom.length === 0
  ) {
    errors.push('Select at least one preference in Kitchen, Living Room, or Bedroom');
  }

  // If there are errors, show them
  if (errors.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      html: `<ul style="text-align:left">${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
    });
    return;
  }

  // If no errors, proceed with form submission
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (key === 'decoration_budget') {
      formData.append('decoration_budget', JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  mutation.mutate(formData);
};


  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Register as Designer
        </Typography>

        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            {/* Profile Image Upload */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <input
                accept="image/*"
                id="profile-image-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-image-upload">
                <Avatar
                  src={imagePreview}
                  sx={{ width: 100, height: 100, mx: 'auto', bgcolor: '#eee', cursor: 'pointer' }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Click to upload profile image
                </Typography>
              </label>
            </Grid>

            {/* Basic Fields */}
            {[{ label: 'Full Name', name: 'designername' }, { label: 'Email', name: 'email', type: 'email' }, { label: 'Password', name: 'password', type: 'password' }, { label: 'Location', name: 'location' }].map((field) => (
              <Grid item xs={12} key={field.name}>
                <TextField
                  fullWidth
                  required={field.name !== 'location'}
                  label={field.label}
                  name={field.name}
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                label="Short Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="style"
                name="style"
                value={form.style}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Home Type */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Your Home Type</InputLabel>
                <Select
                  multiple
                  value={form.decoration_budget.homeType}
                  onChange={(e) => handleBudgetChange('homeType', e.target.value)}
                  input={<OutlinedInput label="Select Your Home Type" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => <Chip key={val} label={val} />)}
                    </Box>
                  )}
                >
                  {homeTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Budget Range */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Your Budget Range</InputLabel>
                <Select
                  multiple
                  value={form.decoration_budget.budget}
                  onChange={(e) => handleBudgetChange('budget', e.target.value)}
                  input={<OutlinedInput label="Select Your Budget Range" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => <Chip key={val} label={val} />)}
                    </Box>
                  )}
                >
                  {budgets.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preferences - Kitchen */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kitchen Preferences</InputLabel>
                <Select
                  multiple
                  value={form.decoration_budget.preferences.kitchen}
                  onChange={(e) => handlePreferencesChange('kitchen', e.target.value)}
                  input={<OutlinedInput label="Kitchen Preferences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => <Chip key={val} label={val} />)}
                    </Box>
                  )}
                >
                  {kitchenPrefs.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preferences - Living Room */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Living Room Preferences</InputLabel>
                <Select
                  multiple
                  value={form.decoration_budget.preferences.livingroom}
                  onChange={(e) => handlePreferencesChange('livingroom', e.target.value)}
                  input={<OutlinedInput label="Living Room Preferences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => <Chip key={val} label={val} />)}
                    </Box>
                  )}
                >
                  {livingroomPrefs.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preferences - Bedroom */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Bedroom Preferences</InputLabel>
                <Select
                  multiple
                  value={form.decoration_budget.preferences.bedroom}
                  onChange={(e) => handlePreferencesChange('bedroom', e.target.value)}
                  input={<OutlinedInput label="Bedroom Preferences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => <Chip key={val} label={val} />)}
                    </Box>
                  )}
                >
                  {bedroomPrefs.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3,backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff' }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
           <Divider sx={{ my: 3 }} />
            
                            <Typography variant="body2" align="center">
                               If u have already account?{' '}
                                <Link to="/designer_login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                    Login here
                                </Link>
                            </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default DesignerRegisterPage;
