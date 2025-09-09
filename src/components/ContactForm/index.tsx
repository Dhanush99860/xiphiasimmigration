"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import { FiMail, FiUser, FiPhone, FiMessageSquare } from "react-icons/fi";

interface ContactFormProps {
  variant?: "full" | "quick"; // choose type
}

const ContactForm: React.FC<ContactFormProps> = ({ variant = "full" }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success(
        variant === "quick"
          ? "Callback request sent successfully!"
          : "Your message has been sent successfully!"
      );
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="w-full max-w-lg mx-auto rounded-2xl shadow-md p-8 border-[7px] border-blue-50 bg-blue-100 dark:bg-black transition-all duration-300 hover:shadow-lg"
      aria-labelledby="contact-form-title"
    >
      {/* Heading */}
      <h2
        id="contact-form-title"
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-snug"
      >
        {variant === "quick" ? (
          <>Request a <span className="text-primary">Quick Callback</span></>
        ) : (
          <>Book a <span className="text-primary">FREE</span> Consultation with Our Expert Advisors</>
        )}
      </h2>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="relative flex items-center group">
          <FiUser className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            aria-label="Full Name"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-[1.5px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
          />
        </div>

        {/* Phone */}
        <div className="relative flex items-center group">
          <FiPhone className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            required
            aria-label="Phone Number"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-[1.5px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
          />
        </div>

        {/* Show Email + Message + Subscribe only in full form */}
        {variant === "full" && (
          <>
            {/* Email */}
            <div className="relative flex items-center group">
              <FiMail className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                aria-label="Email Address"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-[1.5px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
              />
            </div>

            {/* Message */}
            <div className="relative flex items-start group">
              <FiMessageSquare className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                required
                aria-label="Your Message"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-[1.5px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-sm"
              />
            </div>

            {/* Subscribe */}
            <label
              htmlFor="subscribe"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
                value="yes"
                className="h-5 w-5 text-primary focus:ring-primary border-[1.5px] border-gray-300 dark:border-gray-600 rounded transition-all"
              />
              Subscribe for latest updates
            </label>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 text-lg font-semibold rounded-xl bg-primary px-6 py-3 text-white hover:bg-primary/90 focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all border-[1.5px] border-primary disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? <Loader /> : variant === "quick" ? "Request Callback" : "Send Message"}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
