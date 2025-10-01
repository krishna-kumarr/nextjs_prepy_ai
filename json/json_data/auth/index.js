
export default function ({ state, setState, errors }) {
    const json = {
        oauth_errors: {
            invalid_mode: "Invalid mode.",
            code_not_provided: "No code provided.",
            user_not_found: "User Not Found.",
            user_already_exists: "This email is already linked with another account.",
            something_went_wrong: "Something went wrong please try again later.",
        }
    }

    const jsx = {
        login: [
            {
                category: "input",
                type: "text",
                title: "Username",
                name: 'username',
                placeholder: "Enter your username",
                parent_style: { width: '100%', mb: 2 },
                child_style: { width: '100%', borderColor: errors.username ? 'red' : null },
                color: 'primary',
                variant: 'default',

                value: state?.username || "",
                is_mandatory: true,
                Err: errors?.username || '',
                onChange: (e) => setState('username', e.target.value),
            },
            {
                category: "input",
                type: "password",
                title: "Password",
                name: 'password',
                placeholder: "Enter your password",
                parent_style: { width: '100%', mb: 2 },
                child_style: { width: '100%', borderColor: errors?.password ? 'red' : null },
                color: 'primary',
                variant: 'default',

                value: state?.password || "",
                is_mandatory: true,
                Err: errors?.password || '',
                onChange: (e) => setState('password', e.target.value),
            }
        ]
    }

    return { jsx, json }
}