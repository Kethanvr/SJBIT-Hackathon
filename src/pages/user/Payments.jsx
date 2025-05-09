import React from "react";
import PaymentsHeader from "../../components/user/payments/PaymentsHeader";
import PaymentsTabs from "../../components/user/payments/PaymentsTabs";
import PaymentsContent from "../../components/user/payments/PaymentsContent";
import { usePaymentsLogic } from "../../hooks/usePaymentsLogic";

/**
 * Payments page component
 * 
 * This page allows users to:
 * - View and manage their payment methods
 * - Purchase coins for the application
 * - Redeem referral codes for free coins
 * - View their transaction history
 */
const Payments = () => {
  // Use our custom hook for all payment logic
  const {
    activeTab,
    setActiveTab,
    paymentMethods,
    setPaymentMethods,
    payoutMethods,
    setPayoutMethods,
    loading,
    paymentSuccess,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    transactions,
    user,
    profile,
    handleBuyPlan,
    handleBuyCoins,
    processingPackageId,
    handleAddPayoutMethod,
    handleProfileUpdate,
    redeemReferralCode
  } = usePaymentsLogic();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PaymentsHeader />
      <PaymentsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full max-w-full overflow-x-hidden">
        <PaymentsContent
          activeTab={activeTab}
          paymentSuccess={paymentSuccess}
          loading={loading}
          handleBuyPlan={handleBuyPlan}
          handleBuyCoins={handleBuyCoins}
          processingPackageId={processingPackageId}
          user={user}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
          redeemReferralCode={redeemReferralCode}
          paymentMethods={paymentMethods}
          setPaymentMethods={setPaymentMethods}
          payoutMethods={payoutMethods}
          setPayoutMethods={setPayoutMethods}
          handleAddPayoutMethod={handleAddPayoutMethod}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          transactions={transactions}
        />
      </div>
    </div>
  );
};

export default Payments;
