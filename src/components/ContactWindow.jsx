import React from "react";

const ContactWindow = () => {
  return (
    <div>
      <h2>Contact</h2>
      <p>Feel free to reach out about roles, collaborations, or projects.</p>
      <form
        className="contact-form"
        action="https://formspree.io/f/mankpagq"
        method="POST"
      >
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Your email" required />
        <textarea
          name="message"
          rows="4"
          placeholder="Your message"
          required
        ></textarea>
        <button type="submit" className="btn-primary">
          Send Message
        </button>
      </form>
      <p style={{ marginTop: "10px", fontSize: "13px", opacity: 0.8 }}>
        Or connect via{" "}
        <a href="https://github.com/Azzurre" target="_blank" rel="noreferrer">
          GitHub
        </a>{" "}
        or{" "}
        <a
          href="https://www.linkedin.com/in/your-profile"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        .
      </p>
    </div>
  );
};

export default ContactWindow;
