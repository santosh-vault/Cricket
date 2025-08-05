import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";

export const AdminDebugPanel: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    if (!loading) {
      runDebugTests();
    }
  }, [user, loading]);

  const runDebugTests = async () => {
    const results: any = {};

    try {
      // Test 1: Auth Session
      const { data: session } = await supabase.auth.getSession();
      results.authSession = {
        exists: !!session.session,
        userId: session.session?.user?.id,
        email: session.session?.user?.email,
      };

      // Test 2: User Record in Database
      if (session.session?.user?.id) {
        const { data: userRecord, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.session.user.id)
          .single();

        results.userRecord = {
          exists: !!userRecord,
          role: userRecord?.role,
          error: userError?.message,
        };
      }

      // Test 3: Post Read Permission
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id, title, type")
        .limit(3);

      results.postRead = {
        success: !postsError,
        count: posts?.length || 0,
        error: postsError?.message,
      };

      // Test 4: Post Insert Permission (dry run)
      const testPost = {
        title: "Test Permission Check",
        slug: "test-permission-" + Date.now(),
        content: "Test content",
        type: "news",
        category: "test",
        is_published: false,
        tags: ["test"],
      };

      const { data: insertTest, error: insertError } = await supabase
        .from("posts")
        .insert([testPost])
        .select()
        .single();

      results.postInsert = {
        success: !insertError,
        error: insertError?.message,
        code: insertError?.code,
      };

      // Clean up test post if created
      if (insertTest?.id) {
        await supabase.from("posts").delete().eq("id", insertTest.id);
        results.postInsert.cleanedUp = true;
      }
    } catch (error: any) {
      results.generalError = error.message;
    }

    setTestResults(results);
  };

  const createUserRecord = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        role: "admin",
      });

      if (error) {
        alert("Failed to create user record: " + error.message);
      } else {
        alert("User record created successfully!");
        runDebugTests();
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  if (loading) {
    return <div className="p-4 bg-yellow-100 rounded">Loading auth...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-600">
        🔧 Admin Debug Panel
      </h2>

      {/* Auth Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Authentication Status</h3>
        <p>
          <strong>Logged In:</strong> {user ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>User ID:</strong> {user?.id || "N/A"}
        </p>
        <p>
          <strong>Is Admin (useAuth):</strong> {isAdmin ? "✅ Yes" : "❌ No"}
        </p>
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Database Permission Tests</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auth Session Test */}
          <div className="p-3 border rounded">
            <h4 className="font-semibold">1. Auth Session</h4>
            <p
              className={
                testResults.authSession?.exists
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {testResults.authSession?.exists ? "✅ Valid" : "❌ Invalid"}
            </p>
            <small>Email: {testResults.authSession?.email}</small>
          </div>

          {/* User Record Test */}
          <div className="p-3 border rounded">
            <h4 className="font-semibold">2. User Record</h4>
            <p
              className={
                testResults.userRecord?.exists
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {testResults.userRecord?.exists ? "✅ Exists" : "❌ Missing"}
            </p>
            <small>Role: {testResults.userRecord?.role || "N/A"}</small>
            {testResults.userRecord?.error && (
              <p className="text-red-500 text-xs">
                {testResults.userRecord.error}
              </p>
            )}
          </div>

          {/* Post Read Test */}
          <div className="p-3 border rounded">
            <h4 className="font-semibold">3. Read Posts</h4>
            <p
              className={
                testResults.postRead?.success
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {testResults.postRead?.success ? "✅ Success" : "❌ Failed"}
            </p>
            <small>Count: {testResults.postRead?.count || 0}</small>
          </div>

          {/* Post Insert Test */}
          <div className="p-3 border rounded">
            <h4 className="font-semibold">4. Create Posts</h4>
            <p
              className={
                testResults.postInsert?.success
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {testResults.postInsert?.success ? "✅ Allowed" : "❌ Denied"}
            </p>
            {testResults.postInsert?.error && (
              <p className="text-red-500 text-xs">
                {testResults.postInsert.error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={runDebugTests}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Refresh Tests
        </button>

        {!testResults.userRecord?.exists && user && (
          <button
            onClick={createUserRecord}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ➕ Create User Record
          </button>
        )}
      </div>

      {/* Raw Debug Data */}
      <details className="mt-6">
        <summary className="cursor-pointer font-semibold">
          Raw Debug Data
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify({ testResults, user, isAdmin }, null, 2)}
        </pre>
      </details>
    </div>
  );
};
