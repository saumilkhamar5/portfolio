const yearElement = document.getElementById("current-year");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const contactSubmit = document.getElementById("contact-submit");
const formStatus = document.getElementById("form-status");

const emailJsConfig = {
  serviceId: "service_07x7dux",
  templateId: "template_2d923j8",
  publicKey: "avajAHqIlaOLl8BkZ"
};

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.16
  }
);

revealItems.forEach((item) => observer.observe(item));

function setFormStatus(message, type = "") {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.classList.remove("is-success", "is-error");

  if (type) {
    formStatus.classList.add(type);
  }
}

function emailJsReady() {
  return (
    emailJsConfig.serviceId !== "" &&
    emailJsConfig.templateId !== "" &&
    emailJsConfig.publicKey !== ""
  );
}

if (contactForm && contactSubmit) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!emailJsReady()) {
      setFormStatus(
        "Add your EmailJS service ID, template ID, and public key in script.js before sending.",
        "is-error"
      );
      return;
    }

    if (!window.emailjs) {
      setFormStatus("EmailJS failed to load. Please refresh and try again.", "is-error");
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.textContent = "Sending...";
    setFormStatus("Sending your message...");

    try {
      await window.emailjs.sendForm(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        contactForm,
        {
          publicKey: emailJsConfig.publicKey
        }
      );

      contactForm.reset();
      setFormStatus("Message sent successfully. Thank you for reaching out.", "is-success");
    } catch (error) {
      setFormStatus("Message could not be sent. Please check your EmailJS setup and try again.", "is-error");
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = "Send Message";
    }
  });
}
