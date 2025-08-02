import React, { useState } from "react";
import {
  Heart,
  Share2,
  QrCode,
  Mail,
  Send,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { SEOHead } from "../components/seo/SEOHead";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "donation" | "advertising" | "sharing"
  >("donation");
  const [showQR, setShowQR] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sharingUrl = window.location.origin;
  const sharingText =
    "Check out this amazing cricket news platform! 🏏 Stay updated with the latest cricket news, live scores, and analysis.";

  const socialPlatforms = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        sharingUrl
      )}&quote=${encodeURIComponent(sharingText)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        sharingText
      )}&url=${encodeURIComponent(sharingUrl)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        sharingUrl
      )}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(
        sharingText + " " + sharingUrl
      )}`,
      color: "bg-green-600 hover:bg-green-700",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Using Web3Forms - exactly like the example
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("access_key", "3398e628-ed19-462d-9d7d-46ee54c97652");

      // Add spam prevention measures
      formData.append("from_name", formData.get("name") as string);
      formData.append("replyto", formData.get("email") as string);
      formData.append(
        "subject",
        `Cricket Website Contact: ${formData.get("subject")}`
      );

      // Add website info to help with spam filtering
      formData.append("_template", "table");
      formData.append("_captcha", "false");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Success
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        // Reset success status after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } else {
        console.log("Error", data);
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
      setErrorMessage(
        "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <SEOHead
        title="Support Us - Cricket News Platform"
        description="Support our cricket news platform through donations, advertising partnerships, or by sharing with your network."
        keywords="support, donate, advertise, cricket news, partnership"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Our Cricket Community
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Help us continue providing the best cricket news, analysis, and
              live coverage. Choose how you'd like to support us!
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab("donation")}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "donation"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Heart className="h-5 w-5 inline mr-2" />
                Donation
              </button>
              <button
                onClick={() => setActiveTab("advertising")}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "advertising"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Mail className="h-5 w-5 inline mr-2" />
                Advertise with Us
              </button>
              <button
                onClick={() => setActiveTab("sharing")}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "sharing"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Share2 className="h-5 w-5 inline mr-2" />
                Share & Spread
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Donation Section */}
            {activeTab === "donation" && (
              <div className="space-y-8">
                <div className="text-center">
                  <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Support Through Donation
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Your generous donations help us maintain our servers,
                    improve our content quality, and keep providing free cricket
                    news to fans worldwide.
                  </p>
                </div>

                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    {showQR ? "Hide QR Code" : "Donate via QR Code"}
                  </button>
                </div>

                {showQR && (
                  <div className="text-center">
                    <div className="bg-gray-100 p-8 rounded-lg inline-block">
                      <img
                        src="/qr.jpeg"
                        alt="QR Code for Donations"
                        className="w-64 h-64 object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-gray-600 mt-4">
                      Use{" "}
                      <span className="font-semibold text-blue-600">
                        Fonepay
                      </span>{" "}
                      to scan the QR code above and make a secure donation
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Advertising Section */}
            {activeTab === "advertising" && (
              <div className="space-y-8">
                <div className="text-center">
                  <Mail className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Advertise with Us
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Reach passionate cricket fans through our platform. Partner
                    with us to showcase your brand to our engaged audience of
                    cricket enthusiasts.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Banner Advertising, Sponsored Content, Partnership Inquiry"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your advertising goals, target audience, budget, and how you'd like to partner with our cricket platform..."
                    />
                  </div>

                  {/* Honeypot field to prevent spam bots */}
                  <input
                    type="text"
                    name="botcheck"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Advertising Inquiry
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  {submitStatus === "success" && (
                    <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>
                        Thank you for your advertising inquiry! We've received
                        your message and our team will contact you within 24
                        hours to discuss partnership opportunities.
                      </span>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitStatus === "error" && (
                    <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Banner Ads</h3>
                    <p className="text-gray-600">
                      Display ads on our high-traffic pages
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">
                      Sponsored Content
                    </h3>
                    <p className="text-gray-600">
                      Native advertising with our editorial team
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">
                      Newsletter Sponsorship
                    </h3>
                    <p className="text-gray-600">
                      Reach subscribers directly in their inbox
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sharing Section */}
            {activeTab === "sharing" && (
              <div className="space-y-8">
                <div className="text-center">
                  <Share2 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Share & Spread the Word
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Help us grow our cricket community by sharing our platform
                    with your friends, family, and fellow cricket enthusiasts on
                    social media.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Share this link:
                  </h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="text"
                      value={sharingUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                    >
                      {copied ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-sm">
                      Link copied to clipboard!
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-6">
                    Share on Social Media
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {socialPlatforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${platform.color} text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-200 text-center block`}
                      >
                        {platform.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Why Share?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Help fellow cricket fans discover quality content
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Support independent cricket journalism
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Build a stronger cricket community
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      It's completely free and takes just seconds!
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Need Help or Have Questions?
              </h2>
              <p className="mb-6">
                Our team is here to assist you with any inquiries about
                supporting our platform.
              </p>
              <div className="flex justify-center space-x-8">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>superfreundnp@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
