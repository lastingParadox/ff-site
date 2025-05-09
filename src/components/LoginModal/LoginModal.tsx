import { Modal, Box, Typography, TextField, Button, InputAdornment, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AccountCircle, Tag, Send, Visibility, VisibilityOff, KeyboardArrowDown, Clear } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { postData } from '@/utils/api';
import { useAuth } from '@/pages/RootLayout';
import styles from '@/components/LoginModal/loginmodal.module.scss';
import { ColorModeContext } from '@/pages/RootLayout';

export default function LoginModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const authCtx = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { colorMode } = useContext(ColorModeContext);

    const handleLogin = async (username: string, password: string) => {
        await setLoading(true);
        return await postData('login', { username, password })
            .then((response) => {
                if (response.status === 200) {
                    authCtx.login(response.data.user);
                } else if (response.status === 401) {
                    alert('Invalid credentials');
                } else if (response.status === 500) {
                    alert('Server error, please try again later');
                } else {
                    alert('Unknown error, please try again later');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Login failed:', error);
                alert('Server didn\'t respond, please try again later');
                setLoading(false);
            });
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box component='div' className={styles['modal-content']} sx={(theme) => ({
                backgroundColor: theme.palette[colorMode as 'dark' | 'light'].card,
                padding: 2,
                maxWidth: 600,
                borderRadius: 2,
            })}>
                <IconButton aria-label="delete" sx={{
                    float: 'right',
                }} onClick={() => { onClose() }}>
                    <Clear />
                </IconButton>
                <Typography id="modal-modal-title" variant="h4" component="h2">
                    Sign in with your Vortox account
                </Typography>
                <Accordion sx={{
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
                    },
                    '&:first-of-type': {
                        marginTop: '16px !important',
                    },
                    padding: 0,
                    borderRadius: 1,
                    marginTop: 2,
                    marginBottom: 2,
                    'button': {
                        minHeight: 'unset',
                        '&[aria-expanded="true"]': {
                            minHeight: 'unset',
                        },
                    },
                    'span': {
                        margin: '12px 0 !important',
                    }
                }}>
                    <AccordionSummary expandIcon={<KeyboardArrowDown />} sx={{

                    }}>
                        <Typography variant="body2" color="text.secondary">
                            What's a Vortox account?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                            A <Typography component="span" variant="body1" color="primary.light">
                                Vortox account&nbsp;
                            </Typography>
                            is a way to view and modify your Final Frontier data, and is necessary to use the Creator tools.
                        </Typography>
                        <br />
                        <Typography variant="body1" color="text.secondary">
                            You can use this account to sign into the Wiki and Booru, as well.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <TextField label="Username" type="text" variant="outlined" 
                    fullWidth margin="normal" onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} 
                    slotProps={{ 
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            )
                        }
                    }}
                    />
                <TextField label="Password" type={ showPassword ? 'text' : 'password' } variant="outlined" 
                    fullWidth margin="normal" onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    slotProps={{ 
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Tag />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                    />
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <Button variant="contained" color="primary" startIcon={<Send />} loading={loading}
                        onClick={() => handleLogin(username, password)}
                    >
                        Login
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => { onClose() }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}