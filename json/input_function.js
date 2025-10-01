import { Grid } from "@mui/material";
import TextFieldComponent from "~/components/Inputs/textfield";
import Password from "~/components/Inputs/password";

export default function (ip_array) {
    return ip_array.map((ip, index) => {
        switch (ip.category) {
            case "input":
                switch (ip.type) {
                    case "text":
                        return (
                            <Grid sx={ip.parent_style} key={index} >
                                <TextFieldComponent {...ip} ind={index} />
                            </Grid >
                        );

                    case "password":
                        return (
                            <Grid sx={ip.sx} key={index} >
                                <Password {...ip} ind={index} />
                            </Grid>
                        )

                    default:
                        return null;
                }

            default:
                return null;
        }
    });
}
