import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:3005/api/resetpassword/${token}`, { password });
            setMsg(res.data.message);
            setErr('');
            setTimeout(() => navigate('/user/login'), 2000);
        } catch (error) {
            setErr(()=>{error.response?.data?.message || 'Reset failed'});
           
            setMsg('');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
        }}>
            <Paper elevation={6} sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Reset Password
                </Typography>
                {msg && <Alert severity="success">{msg}</Alert>}
                {err && <Alert severity="error">{err}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff'}}>
                        Reset Password
                    </Button>
                </form>
            </Paper>

        </Box>
    );
};

export default ResetPassword;
