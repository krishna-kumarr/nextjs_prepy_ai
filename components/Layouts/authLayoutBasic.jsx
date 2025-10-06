"use client";

import { image } from "~/public/image";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export function AuthLayoutBasic({ children }) {
    const pathname = usePathname();
    const dynamic_image = {
        '/': image.signin_image,
        '/signup': image.signup_image
    };

    return (
        <Grid sx={{ height: '100vh', p: 1 }}>
            <Box sx={{
                height: '52%',
                width: '100%',
                background: `linear-gradient(310deg, rgba(20, 23, 39, 0.6), rgba(58, 65, 111, 0.6)) center center / cover no-repeat, url(${dynamic_image[pathname]}) transparent`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2
            }}>
                <Container>
                    <Typography variant="body1" sx={{ fontWeight: 600, p: 2, color: "white" }}> Adra Product Studio </Typography>
                </Container>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, p: 5, pb: 1, color: "white" }}>
                        Welcome!
                    </Typography>

                    <Typography variant="body1" sx={{ px: 5, color: "white" }}>
                        Use these awesome forms to login or create new account in your project for free.
                    </Typography>
                </Box>
            </Box>

            <Card sx={{
                position: 'absolute',
                top: '61%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '50%',
                width: { xs: "80%", sm: "70%", md: "45%", lg: "40%", xl: "24%" },
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                boxShadow: '2px 4px 20px rgba(0, 0, 0, 0.1)',
            }} >
                {children}
            </Card>
        </Grid >
    );
}
