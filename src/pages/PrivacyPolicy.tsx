import React from "react";
import { SEOHead } from "../components/seo/SEOHead";
import { Shield, Lock, Eye, Database, Users, Calendar } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy - CricNews"
        description="Read our privacy policy to understand how CricNews collects, uses, and protects your personal information."
        keywords="privacy policy, data protection, personal information, cookies, user privacy"
        type="website"
        url="/privacy-policy"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Your privacy is important to us. Learn how we protect and handle
              your information.
            </p>
            <div className="mt-8 text-sm text-gray-300">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-600" />
                  Introduction
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  CricNews ("we," "our," or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit
                  our website and use our services.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By using our website, you consent to the data practices
                  described in this policy. If you do not agree with our
                  policies and practices, please do not use our website.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Database className="h-6 w-6 mr-3 text-blue-600" />
                  Information We Collect
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Personal Information
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      We may collect personal information that you voluntarily
                      provide to us, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                      <li>
                        Name and email address (when you subscribe to our
                        newsletter)
                      </li>
                      <li>Comments and feedback you provide on our articles</li>
                      <li>Information you provide when contacting us</li>
                      <li>Account information if you create an account</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Automatically Collected Information
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      When you visit our website, we automatically collect
                      certain information, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Pages visited and time spent on our website</li>
                      <li>Referring website and search terms</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-blue-600" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect for various purposes,
                  including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Providing and maintaining our website and services</li>
                  <li>
                    Personalizing your experience and delivering relevant
                    content
                  </li>
                  <li>Sending newsletters and updates (with your consent)</li>
                  <li>Analyzing website usage and improving our services</li>
                  <li>Responding to your comments, questions, and requests</li>
                  <li>Detecting and preventing fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-blue-600" />
                  Information Sharing and Disclosure
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except in
                  the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>
                    With service providers who assist us in operating our
                    website
                  </li>
                  <li>
                    To comply with legal requirements or protect our rights
                  </li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-blue-600" />
                  Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance
                  your browsing experience. Cookies are small text files stored
                  on your device that help us:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve website functionality and performance</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  You can control cookie settings through your browser
                  preferences. However, disabling cookies may affect website
                  functionality.
                </p>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-600" />
                  Data Security
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Secure hosting and infrastructure</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  However, no method of transmission over the internet is 100%
                  secure, and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Rights
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights
                  regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>
                    The right to access and receive a copy of your personal
                    information
                  </li>
                  <li>
                    The right to correct inaccurate or incomplete information
                  </li>
                  <li>The right to delete your personal information</li>
                  <li>The right to restrict or object to processing</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  To exercise these rights, please contact us using the
                  information provided below.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Children's Privacy
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Our website is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you are a parent or guardian and believe
                  your child has provided us with personal information, please
                  contact us immediately.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-blue-600" />
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date. We encourage
                  you to review this Privacy Policy periodically for any
                  changes.
                </p>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Us
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:superfreundnp@gmail.com"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      superfreundnp@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Address:</strong> CricNews Privacy Team
                  </p>
                  <p className="text-gray-700">
                    <strong>Response Time:</strong> We will respond to your
                    inquiry within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
