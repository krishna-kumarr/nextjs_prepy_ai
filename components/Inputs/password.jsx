import React from "react";
import { IconButton, InputAdornment, InputBase } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function (props) {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleMouseUpPassword = (event) => event.preventDefault();

    return (
        <InputBase
            id={`outlined-adornment-password_${props.ind}`}
            type={showPassword ? "text" : "password"}
            name={props?.name || ""}
            color={props?.color || "secondary"}
            value={props?.value || ""}
            onChange={props.onChange || null}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label={showPassword ? "hide the password" : "display the password"}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            }
            label={props?.floating_label ? "Password" : ""}
            placeholder={props?.floating_label ? "" : props?.title || "sample label"}
            sx={props.child_style}
            variant={props.variant || "outlined"}
            size={props.size || null}
        />
    );
}