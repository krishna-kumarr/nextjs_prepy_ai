'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        layoutHeading: {
            main: '#c33030ff',
            gradient: 'linear-gradient(to right, #23abe5ff, #29a5f7ff)',
        },
        gray: {
            main: "#808080"
        },
    },
    typography: {
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1rem' },
        button: { textTransform: 'none' }
    },
    shape: {
        borderRadius: 6,
    },
    components: {
        MuiTypography: {
            variants: [
                {
                    props: { variant: 'auth_basic_heading' },
                    style: {
                        display: 'block',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        background: 'linear-gradient(to right, #787879ff, #898b8dff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    },
                },
            ],
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'sign_in_button' },
                    style: {
                        fontSize: '0.875rem', // fixed invalid .0.3rem
                        fontWeight: 600,
                        color: 'white',
                        textTransform: 'uppercase',
                        minHeight: '2rem',
                        boxShadow: 'rgba(0, 0, 0, 0.11) 0rem 0.25rem 0.4375rem -0.0625rem, rgba(0, 0, 0, 0.07) 0rem 0.125rem 0.25rem -0.0625rem',
                        padding: '0.65rem 1.5rem',
                        background: 'linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))',
                        borderRadius: 6,
                    },
                },
                {
                    props: { variant: 'sign_up_button' },
                    style: {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'white',
                        textTransform: 'uppercase',
                        minHeight: '2rem',
                        boxShadow: 'rgba(0, 0, 0, 0.11) 0rem 0.25rem 0.4375rem -0.0625rem, rgba(0, 0, 0, 0.07) 0rem 0.125rem 0.25rem -0.0625rem',
                        padding: '0.65rem 1.5rem',
                        background: 'linear-gradient(310deg, rgb(20, 23, 39), rgb(58, 65, 111))',
                        borderRadius: 6,
                    },
                },
            ],
        },
        MuiInputBase: {
            variants: [
                {
                    props: { variant: 'default' },
                    style: {
                        letterSpacing: "0.00938em",
                        cursor: "text",
                        display: "flex",
                        width: "100%",
                        height: "auto",
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        lineHeight: 1.4,
                        color: "rgb(73, 80, 87)",
                        border: "1px solid rgb(210, 214, 218)",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        "&::placeholder": {
                            color: "#9ca3af",
                            fontSize: "0.9rem",
                        },
                    },
                }
            ],
        },
    },
});

export default theme;
