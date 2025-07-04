import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList'; // Keep this if you still want the full list elsewhere
import { Link } from 'react-router-dom';
import { Trophy, CalendarDays, Flag } from 'lucide-react'; // More relevant icons for fixtures

export const Fixtures: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Cricket Fixtures - CricNews"
        description="Check upcoming cricket matches, live games, and completed fixtures. Stay updated with match schedules, venues, and tournament information."
        keywords="cricket fixtures, cricket schedule, upcoming matches, live cricket, cricket calendar, T20, ODI, Test"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-800">
        {/* Header Section */}
        <section className="bg-white shadow-md border-b border-blue-100 py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4 tracking-tight">
                Cricket Fixtures
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Stay updated with **upcoming matches**, **live games**, and **tournament schedules** from around the world. Never miss a moment!
              </p>
            </div>
          </div>
        </section>



        {/* If the above cards entirely replace what FixturesList does, you can remove this section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">All Fixtures</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 md:p-6 lg:p-8">
              <FixturesList
                compact={false}
                showHeader={false}
                className=""
              />
            </div>
          </div>
        </section>
        {/* --- END Original FixturesList Section --- */}


        {/* Placeholder for a simple footer if needed, outside the main content area */}
        <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} CricNews. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};