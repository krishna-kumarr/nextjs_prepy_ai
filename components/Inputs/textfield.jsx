import { InputBase, Typography } from "@mui/material";
import React from "react";

export default function (props) {
    return (
        <React.Fragment>
            <InputBase
                sx={props.child_style || null}
                name={props?.name || ""}
                id={`${props?.variant}-controlled_${props?.ind}`}
                fullWidth={props?.fullWidth || false}
                color={props?.color || 'primary'}
                size={props?.size || null}
                variant={props?.variant || 'outlined'}
                label={props?.floating_label ? props?.title || "sample label" : ""}
                placeholder={props?.floating_label ? "" : props?.title || "sample label"}
                value={props?.value || ""}
                onChange={props?.onChange || null}
                required={props?.is_mandatory || false}
            />

            {/* {props.Err && <Typography as="p" variant="body2" color="error" sx={{ margin: '0.5rem 0 0 0.3rem' }}>{props.Err}</Typography>} */}
        </React.Fragment>
    )
}