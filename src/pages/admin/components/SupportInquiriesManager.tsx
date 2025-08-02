import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Mail,
  Building,
  Calendar,
  DollarSign,
  MessageSquare,
  Eye,
  Check,
  X,
} from "lucide-react";

interface SupportInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string | null;
  created_at: string;
  status: "pending" | "contacted" | "closed";
}

export const SupportInquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<SupportInquiry | null>(
    null
  );

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("support_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (
    id: string,
    status: "pending" | "contacted" | "closed"
  ) => {
    try {
      const { error } = await supabase
        .from("support_inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Support Inquiries</h2>
        <div className="text-sm text-gray-500">
          {inquiries.length} total inquiries
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No support inquiries yet
          </h3>
          <p className="text-gray-500">
            When users submit advertising inquiries, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {inquiry.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              {inquiry.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Building className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              {inquiry.company}
                            </div>
                            {inquiry.budget && (
                              <div className="flex items-center text-sm text-gray-500">
                                <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {inquiry.budget}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {formatDate(inquiry.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {inquiry.status === "pending" && (
                      <button
                        onClick={() =>
                          updateInquiryStatus(inquiry.id, "contacted")
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="Mark as Contacted"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    {inquiry.status !== "closed" && (
                      <button
                        onClick={() =>
                          updateInquiryStatus(inquiry.id, "closed")
                        }
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Closed"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for viewing inquiry details */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Support Inquiry Details
                </h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInquiry.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInquiry.company}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Budget
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInquiry.budget || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedInquiry.status
                      )}`}
                    >
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Submitted
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedInquiry.created_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: Advertising Inquiry from ${selectedInquiry.company}&body=Hi ${selectedInquiry.name},%0D%0A%0D%0AThank you for your interest in advertising with us.%0D%0A%0D%0ABest regards`}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
