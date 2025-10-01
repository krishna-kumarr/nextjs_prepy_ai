import auth_json from "./auth";

export default function (props) {
    const authFields = auth_json(props);

    return {
        auth_json: authFields,
    };
}