import React from "react";
import { FiDollarSign, FiPlus, FiInfo } from "react-icons/fi";
import PaymentMethodCard from "./PaymentMethodCard";
import PayoutMethodCard from "./PayoutMethodCard";
import PaymentSuccessMessage from "./PaymentSuccessMessage";
import ReferralCodeCard from './ReferralCodeCard';
import CoinsSection from "./CoinsSection";
import PaymentHistory from "./PaymentHistory";

/**
 * Content component for the Payments page based on active tab
 */
const PaymentsContent = ({
  activeTab,
  paymentSuccess,
  loading,
  handleBuyPlan,
  handleBuyCoins,
  processingPackageId,
  user,
  profile,
  onProfileUpdate,
  redeemReferralCode,
  paymentMethods,
  setPaymentMethods,
  payoutMethods,
  setPayoutMethods,
  handleAddPayoutMethod,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  transactions
}) => {  // Filter transactions based on search query and status filter
  const filteredTransactions = transactions.filter(transaction => {
    // Defensive: log transaction if not a plain object
    if (typeof transaction !== 'object' || transaction == null) {
      console.warn('Invalid transaction object:', transaction);
      return false;
    }
    // Apply status filter
    if (filterStatus !== "all" && transaction.status !== filterStatus) {
      return false;
    }
    // Apply search filter if there's a query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        (typeof transaction.description === 'string' && transaction.description.toLowerCase().includes(query)) ||
        (typeof transaction.date === 'string' && transaction.date.toLowerCase().includes(query)) ||
        (typeof transaction.amount === 'number' && transaction.amount.toString().includes(query))
      );
    }
    return true;
  });
  
  return (
    <div className="flex-1 pb-20">
      <div className="max-w-lg mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {activeTab === "payments" && (
          <>
            {/* Referral Program Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-3 sm:p-4 border-b">
                <h2 className="text-base sm:text-lg font-medium">Referral Program</h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Share and earn rewards with our referral program.
                </p>
              </div>
              {paymentSuccess ? (
                <PaymentSuccessMessage />
              ) : (
                <>
                  {/* Referral Code Card */}
                  <ReferralCodeCard
                    user={user}
                    profile={profile}
                    onProfileUpdate={onProfileUpdate}
                    redeemReferralCode={redeemReferralCode}
                  />
                </>
              )}
            </div>
            
            {/* Coins Section */}
            <CoinsSection 
              loading={loading}
              processingPackageId={processingPackageId}
              onBuyCoins={handleBuyCoins}
              currentCoins={profile?.coins || 0}
            />
            
            {/* Payment Methods Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-3 sm:p-4 border-b">
                <h2 className="text-base sm:text-lg font-medium">Saved Payment Methods</h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Manage your saved cards (if applicable).
                </p>
              </div>
              {paymentMethods.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      onRemove={() => setPaymentMethods(paymentMethods.filter((m) => m.id !== method.id))}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-500">
                  No saved payment methods.
                </div>
              )}
            </div>
          </>
        )}
        
        {activeTab === "transactions" && (
          <PaymentHistory
            transactions={transactions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
        
        {activeTab === "payouts" && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-medium">Payout Methods</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Add or remove payout methods
              </p>
            </div>
            
            {/* Feature Coming Soon Note */}
            <div className="p-3 sm:p-4 bg-yellow-50 border-b border-yellow-100 flex items-start space-x-2 sm:space-x-3">
              <FiInfo className="text-yellow-500 w-4 sm:w-5 h-4 sm:h-5 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-yellow-700 font-medium">
                This feature will be available soon. Currently showing sample data to demonstrate how payouts will work in the future.
              </p>
            </div>
            
            {payoutMethods.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {payoutMethods.map((method) => (
                  <PayoutMethodCard
                    key={method.id}
                    method={method}
                    onRemove={() => setPayoutMethods(payoutMethods.filter((m) => m.id !== method.id))}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <FiDollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  No payout methods
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 max-w-sm px-4">
                  Connect a bank account to receive payments from patients
                </p>
              </div>
            )}
            <div className="p-3 sm:p-4">
              <button
                onClick={handleAddPayoutMethod}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{loading ? "Adding..." : "Add Payout Method"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsContent;
