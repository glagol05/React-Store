import { useState } from "react";

function DynamicForm({ descriptor, onSubmit }) {
    const [values, setValues] = useState({});

    function handleChange(name, value) {
        setValues((previousValues) => ({
            ...previousValues,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit}>
        <h2>{descriptor.name}</h2>
        <p>{descriptor.description}</p>

        {descriptor.fields.map((field) => (
            <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>

            {field.type === "select" ? (
                <select
                id={field.name}
                value={values[field.name] ?? ""}
                onChange={(event) =>
                    handleChange(field.name, event.target.value)
                }
                required={field.required}
                >
                <option value="">Välj alternativ</option>
                {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </select>
            ) : (
                <input
                id={field.name}
                type={field.type}
                value={values[field.name] ?? ""}
                onChange={(event) =>
                    handleChange(
                    field.name,
                    field.type === "number"
                        ? Number(event.target.value)
                        : event.target.value
                    )
                }
                required={field.required}
                />
            )}
            </div>
        ))}

        <button type="submit">Beräkna</button>
        </form>
    );
}

export default DynamicForm;
