import React from "react";
import { SEOHead } from "../components/seo/SEOHead";
import { Trophy, Users, Globe, Target, Award, Heart } from "lucide-react";

export const AboutUs: React.FC = () => {
  return (
    <>
      <SEOHead
        title="About Us - CricNews"
        description="Learn about CricNews, your premier destination for cricket news, analysis, and insights. Discover our mission to bring you the latest cricket updates from around the world."
        keywords="about us, cricket news, cricket analysis, cricket website, cricket coverage"
        type="website"
        url="/about-us"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About CricNews
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Your premier destination for comprehensive cricket coverage,
              analysis, and insights
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide cricket enthusiasts worldwide with accurate, timely,
                and engaging coverage of the sport we all love.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Comprehensive Coverage
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  From international matches to domestic leagues, we cover all
                  aspects of cricket with detailed analysis and expert insights.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <Award className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Quality Journalism
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team of experienced cricket journalists and analysts
                  deliver high-quality content that keeps you informed and
                  engaged.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What We Do
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Live Coverage
                </h3>
                <p className="text-gray-600">
                  Real-time updates, live scores, and comprehensive match
                  reports from cricket events around the world.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Expert Analysis
                </h3>
                <p className="text-gray-600">
                  In-depth analysis from cricket experts, former players, and
                  seasoned commentators.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Global Reach
                </h3>
                <p className="text-gray-600">
                  Covering cricket from all corners of the world, bringing you
                  stories from every cricket-playing nation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Passion for Cricket
                  </h3>
                  <p className="text-gray-600">
                    We share the same passion for cricket that our readers have,
                    driving us to deliver the best coverage possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Accuracy & Reliability
                  </h3>
                  <p className="text-gray-600">
                    We prioritize accuracy in our reporting, ensuring our
                    readers can trust the information we provide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Community Focus
                  </h3>
                  <p className="text-gray-600">
                    We believe in building a strong cricket community and
                    fostering meaningful discussions about the sport.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Excellence
                  </h3>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, from our
                    writing to our website design and user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Have questions, suggestions, or want to contribute? We'd love to
              hear from you!
            </p>
            <div className="bg-blue-50 rounded-xl p-8">
              <p className="text-gray-700 mb-4">
                Email us at:{" "}
                <a
                  href="mailto:superfreundnp@gmail.com"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  superfreundnp@gmail.com
                </a>
              </p>
              <p className="text-gray-700">
                Follow us on social media for the latest updates and
                behind-the-scenes content.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
