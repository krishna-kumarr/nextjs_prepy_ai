'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CardContent, Divider, IconButton, Stack, Typography } from "@mui/material";

import jsx_json from "~/json/json_data";
import input_function from "~/json/input_function";
import { AuthLayoutBasic } from "~/components/Layouts/authLayoutBasic";
import { icons } from "~/public/icons";
import { encryptEndpointAndRedirect } from "~/utils/crypto";

export default function Signup() {
    const [auth_credentials, setAuthCredentials] = useState({});
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const { auth_json } = jsx_json({ state: auth_credentials, setState, errors, setErrors });

    function setState(field, value) {
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
        setAuthCredentials(prev => ({ ...prev, [field]: value }));
    }

    async function login() {
        const new_errors = {};
        if (!auth_credentials.username) new_errors.username = "Username is required";
        if (!auth_credentials.password) new_errors.password = "Password is required";

        if (Object.keys(new_errors).length) {
            setErrors(new_errors);
            return;
        }
    }

    return (
        <AuthLayoutBasic>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: "rgb(52, 71, 103)", fontWeight: 600, fontSize: "1.25rem", mb: 3 }}>
                        Sign Up
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
                        <IconButton
                            aria-label="Google"
                            sx={{ border: 1, borderColor: 'rgb(210, 214, 218)', borderRadius: 1, px: 2 }}
                            onClick={() => encryptEndpointAndRedirect("auth/google/signup")}
                        >
                            {icons.google_icons}
                        </IconButton>
                    </Stack>
                </Box>

                <Box sx={{ px: 3, py: 1 }}>
                    {input_function(auth_json.jsx.login)}

                    <Stack direction="column" spacing={2} justifyContent="center" mt={4}>
                        <Button variant="sign_in_button" onClick={login}>Sign Up</Button>

                        <Divider sx={{ fontSize: '0.7rem' }}>Or</Divider>

                        <Button variant="sign_up_button" onClick={() => router.push('signup')}>Sign up</Button>
                    </Stack>
                </Box>
            </CardContent>
        </AuthLayoutBasic>
    );
}