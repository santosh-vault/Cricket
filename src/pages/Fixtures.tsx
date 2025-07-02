import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList';

export const Fixtures: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Cricket Fixtures"
        description="Check upcoming cricket matches, live games, and completed fixtures. Stay updated with match schedules, venues, and tournament information."
        keywords="cricket fixtures, cricket schedule, upcoming matches, live cricket, cricket calendar"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-green-900 mb-4">Cricket Fixtures</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay updated with upcoming matches, live games, and tournament schedules from around the world
              </p>
            </div>
          </div>
        </section>

        {/* Fixtures Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FixturesList 
              compact={false} 
              showHeader={false}
              className=""
            />
          </div>
        </section>
      </div>
    </>
  );
};