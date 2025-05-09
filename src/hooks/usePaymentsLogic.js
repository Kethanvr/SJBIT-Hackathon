import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { loadRazorpayScript } from "../utils/paymentsUtils";
import profileService from "../services/profileService";
import paymentService from "../services/paymentService";
import authService from "../services/authService";

/**
 * Custom hook containing all the payment page logic
 * @returns {Object} Payment state and handlers
 */
export const usePaymentsLogic = () => {
  // State
  const [activeTab, setActiveTab] = useState("payments");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingPackageId, setProcessingPackageId] = useState(null);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2025-03-28",
      description: "Consultation with Dr. Smith",
      amount: -150.0,
      status: "completed",
    },
    {
      id: 2,
      date: "2025-03-15",
      description: "Lab Test Results",
      amount: -75.5,
      status: "completed",
    },
    {
      id: 3,
      date: "2025-02-20",
      description: "Insurance Reimbursement",
      amount: 125.0,
      status: "pending",
    },
  ]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get current user using authService
        const user = await authService.getCurrentUser();
        if (user) {
          setUser(user);
          
          // Fetch profile data using profileService
          const profileData = await profileService.getProfile(user.id);
          setProfile(profileData);
          
          // Fetch transactions using paymentService
          const paymentHistory = await paymentService.getPaymentHistory(user.id);
          if (paymentHistory?.length) {
            setTransactions(paymentHistory);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    
    fetchUserDetails();
  }, []);

  // Handle buying pro plan
  const handleBuyPlan = async () => {
    setLoading(true);
    setPaymentSuccess(false);
    if (!user) {
      alert("Please log in to make a payment");
      setLoading(false);
      return;
    }
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay checkout. Please check your internet connection.");
      setLoading(false);
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: "10000", // Amount in paise (100 INR)
      currency: "INR",
      name: "MediScan Gold Plan",
      description: "One-time payment for Pro features",
      handler: async function (response) {
        // This function is called after successful payment
        console.log("Payment Successful:", response);
        
        try {
          // Match the exact schema of the payment_history table in your database
          const paymentData = {
            profile_id: user.id,
            payment_id: response.razorpay_payment_id,
            amount: 10000, // In paise
            status: "completed", // Make sure this exactly matches your check constraint
            currency: "INR",
            plan_name: "MediScan Gold Plan",
            // created_at is auto-added by Supabase
          };
          
          // Add order_id and signature only if they exist in the response
          if (response.razorpay_order_id) {
            paymentData.order_id = response.razorpay_order_id;
          }
          
          if (response.razorpay_signature) {
            paymentData.signature = response.razorpay_signature;
          }
          
          console.log("Saving payment data:", paymentData);
          
          // Save transaction to Supabase
          const { data, error } = await supabase
            .from("payment_history")
            .insert([paymentData])
            .select();
            
          if (error) throw error;
          
          // Update user's plan status in profiles table
          await supabase
            .from("profiles")
            .update({ 
              pro_user: true,
              pro_since: new Date().toISOString() 
            })
            .eq("id", user.id);
            
          setPaymentSuccess(true);
        } catch (error) {
          console.error("Error saving payment details:", error);
          alert("Payment was successful, but we couldn't update your account. Please contact support.");
        }
        
        setLoading(false);
      },
      prefill: {
        name: profile?.full_name || user?.email?.split('@')[0] || "",
        email: user?.email || "",
        contact: profile?.phone || "",
      },
      notes: {
        address: profile?.address || "MediScan User",
        userId: user?.id,
      },
      theme: { color: "#3B82F6" },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };
    try {
      // Create a new Razorpay instance
      const razorpayInstance = new window.Razorpay(options);
      
      // Add event handler for payment failures
      razorpayInstance.on("payment.failed", async function (response) {
        console.error("Payment Failed:", response.error);
        
        try {
          // Log the failed payment attempt in Supabase
          await supabase
            .from("payment_history")
            .insert([{
              user_id: user.id,
              payment_id: response.error?.metadata?.payment_id || null,
              amount: 10000,
              currency: "INR",
              status: "failed",
              plan_name: "MediScan Gold Plan",
              failure_reason: response.error?.description || "Unknown error",
              error_code: response.error?.code || "UNKNOWN",
              payment_date: new Date().toISOString()
            }]);
        } catch (dbError) {
          console.error("Error logging failed payment:", dbError);
        }
        
        setLoading(false);
        alert(
          `Payment Failed: ${response.error.description} (Code: ${response.error.code})`
        );
      });

      // Open the Razorpay checkout modal
      razorpayInstance.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      setLoading(false);
      alert("Unable to initialize payment. Please try again later.");
    }
  };

  /**
   * Handler for buying coins packages
   * @param {Object} coinPackage - The coin package to purchase
   */  const handleBuyCoins = async (coinPackage) => {
    setProcessingPackageId(coinPackage.id);
    setLoading(true);
    
    if (!user) {
      alert("Please log in to make a payment");
      setLoading(false);
      setProcessingPackageId(null);
      return;
    }
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay checkout. Please check your internet connection.");
      setLoading(false);
      setProcessingPackageId(null);
      return;
    }
    
    // Amount in paise (INR)
    const amountInPaise = coinPackage.price * 100;
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amountInPaise.toString(),
      currency: "INR",
      name: `${coinPackage.coins} MediScan Coins`,
      description: `Purchase ${coinPackage.coins} coins for scanning and AI chat`,      handler: async function (response) {
        try {
          // Use paymentService to process the coin purchase
          const result = await paymentService.processCoinPurchase(
            user.id,
            coinPackage,
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
          
          if (result.success) {
            // Update profile with the new coin balance
            setProfile(result.profile);
            
            // Add transaction to the list for immediate display
            const newTransaction = result.transaction;
            
            setTransactions([newTransaction, ...transactions]);
            
            alert(`Successfully purchased ${coinPackage.coins} coins!`);
          }
        } catch (error) {
          console.error("Error processing coin purchase:", error);
          alert("Payment was successful, but we couldn't update your coins. Please contact support.");
        } finally {
          setLoading(false);
          setProcessingPackageId(null);
        }
      },
      prefill: {
        name: profile?.full_name || user?.email?.split('@')[0] || "",
        email: user?.email || "",
        contact: profile?.phone || "",
      },
      notes: {
        address: profile?.address || "MediScan User",
        userId: user?.id,
        coinPackage: coinPackage.id
      },
      theme: { color: "#3B82F6" },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setProcessingPackageId(null);
        },
      },
    };
    
    try {
      // Create a new Razorpay instance
      const razorpayInstance = new window.Razorpay(options);
      
      // Add event handler for payment failures
      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        setLoading(false);
        setProcessingPackageId(null);
        alert(
          `Payment Failed: ${response.error.description} (Code: ${response.error.code})`
        );
      });

      // Open the Razorpay checkout modal
      razorpayInstance.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      setLoading(false);
      setProcessingPackageId(null);
      alert("Unable to initialize payment. Please try again later.");
    }
  };

  // Handle adding a payout method
  const handleAddPayoutMethod = () => {
    // This would typically open a payout method form or connect to a payment processor
    setLoading(true);
    setTimeout(() => {
      setPayoutMethods([
        ...payoutMethods,
        {
          id: Date.now(),
          type: "bank_account",
          last4: "1234",
          bankName: "Example Bank",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  // Handler to update profile after referral code redemption
  const handleProfileUpdate = (profileData) => setProfile(profileData);
  // Wrapper for profileService.redeemReferralCode
  const redeemReferralCode = async ({ code, user, profile, onProfileUpdate }) => {
    if (!user) {
      return { success: false, message: "Please log in to redeem a code." };
    }
    
    try {
      const result = await profileService.redeemReferralCode(user.id, code);
      
      // Refresh profile after successful redemption
      if (result.success && onProfileUpdate) {
        const updatedProfile = await profileService.getProfile(user.id);
        onProfileUpdate(updatedProfile);
      }
      
      return result;
    } catch (error) {
      console.error("Error redeeming referral code:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later."
      };
    }
  };

  return {
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
  };
};
