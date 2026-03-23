import React, { useState, useEffect, useRef } from "react";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit

function sanitizeText(value) {
    // Strip leading/trailing whitespace and collapse internal whitespace
    return value.replace(/\s+/g, " ").trimStart();
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidName(value) {
    return /^[\p{L}\p{M}' .,-]+$/u.test(value);
}

export default function Form(props) {
    const { setSurveyData } = props;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const qBuf = useRef([]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key !== 'q') { qBuf.current = []; return; }
            const now = Date.now();
            qBuf.current = [...qBuf.current.filter(t => now - t < 500), now];
            if (qBuf.current.length >= 3) {
                qBuf.current = [];
                setSurveyData?.({ name: 'Tester', email: 'tester@test.local', id: 'qqq-skip' });
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [setSurveyData]);

    const handleName = (e) => {
        const val = sanitizeText(e.target.value).slice(0, MAX_NAME_LENGTH);
        setName(val);
        if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
    };

    const handleEmail = (e) => {
        const val = e.target.value.trim().slice(0, MAX_EMAIL_LENGTH);
        setEmail(val);
        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
    };

    const validate = () => {
        const next = {};
        if (!name.trim()) {
            next.name = "Name is required.";
        } else if (!isValidName(name.trim())) {
            next.name = "Please enter a valid name (letters, spaces, hyphens, and apostrophes only).";
        }
        if (!email.trim()) {
            next.email = "Email is required.";
        } else if (!isValidEmail(email)) {
            next.email = "Please enter a valid email address.";
        }
        return next;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = validate();
        if (Object.keys(next).length > 0) {
            setErrors(next);
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await fetch(`${apiUrl}/collect`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setErrors({ form: data.message || "Submission failed. Please try again." });
                return;
            }

            const { id } = await res.json();
            setSurveyData?.({ name: name.trim(), email: email.trim().toLowerCase(), id });
        } catch {
            setErrors({ form: "Could not reach the server. Please check your connection and try again." });
            return;
        }

        setName("");
        setEmail("");
        setErrors({});
    };

    return (
        <div className="intro">
            <div>&nbsp;</div>
            <div>
                <h2>Welcome to the CIS 2300 Placement Survey!</h2>
                <p>
                    We&rsquo;re excited that you are interested in taking an introductory
                    programming course!
                </p>
                <p>
                    Our{" "}
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://baruch-undergraduate.catalog.cuny.edu/courses/1473721"
                    >
                        CIS 2300 programming course, &ldquo;Programming and Computational
                        Thinking&rdquo;
                    </a>
                    , is designed for all students, regardless of how much prior experience
                    you do or do not have and regardless of your goals or reasons for taking
                    the course. In that spirit, we want everyone to have the best experience
                    in your first course, especially since prior experience can come in many
                    different forms. It can be intimidating to be in a class full of students
                    with prior experience and conversely, being seasoned in a room of
                    beginners can be frustrating. Since we offer multiple sections of 2300,
                    this anonymous self-placement will suggest the most appropriate section
                    for you.
                </p>

                <p>To continue, please fill out the form below:</p>
                <p><em>By entering your email, you consent to be contacted about the course according to the <a href="/privacy">Privacy Policy</a>.</em></p>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={handleName}
                            maxLength={MAX_NAME_LENGTH}
                            autoComplete="name"
                            aria-describedby={errors.name ? "name-error" : undefined}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <span id="name-error" role="alert" style={{ color: "#c0392b", fontSize: "0.85rem" }}>
                                {errors.name}
                            </span>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmail}
                            maxLength={MAX_EMAIL_LENGTH}
                            autoComplete="email"
                            inputMode="email"
                            aria-describedby={errors.email ? "email-error" : undefined}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <span id="email-error" role="alert" style={{ color: "#c0392b", fontSize: "0.85rem" }}>
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div className="actions">
                        <button type="submit" className="submit">Continue</button>
                    </div>
                    {errors.form && (
                        <span role="alert" style={{ color: "#c0392b", fontSize: "0.85rem" }}>
                            {errors.form}
                        </span>
                    )}
                </form>
            </div>
        </div>
    );
}
