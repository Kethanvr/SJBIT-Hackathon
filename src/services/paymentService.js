import { supabase } from '../lib/supabase';
import profileService from './profileService';
import { handleError, ErrorTypes, AppError } from '../utils/errorHandler';
import apiErrorService from './apiErrorService';

/**
 * Service for handling payment-related operations
 */
const paymentService = {
  /**
   * Process coin package purchase
   * @param {string} userId - User ID
   * @param {Object} coinPackage - Coin package object with coins and price
   * @param {string} paymentId - Payment ID from payment processor
   * @param {string} orderId - Order ID from payment processor (optional)
   * @param {string} signature - Payment signature for verification (optional)
   * @returns {Promise<Object>} Updated profile with new coin balance
   */
  processCoinPurchase: async (userId, coinPackage, paymentId, orderId = null, signature = null) => {
    // Validate inputs
    const validation = apiErrorService.validateInput(
      { userId, coinPackage, paymentId },
      [
        { field: 'userId', value: userId, required: true, message: 'User ID is required' },
        { field: 'coinPackage', value: coinPackage, required: true, 
          validator: val => val && typeof val.coins === 'number',
          message: 'Valid coin package with coins property is required' 
        },
        { field: 'paymentId', value: paymentId, required: true, message: 'Payment ID is required' }
      ]
    );
    
    if (!validation.isValid) {
      throw new AppError(validation.message, ErrorTypes.VALIDATION, null, validation.errors);
    }
    
    try {
      // 1. Save payment record in transaction history
      const paymentData = {
        profile_id: userId,
        payment_id: paymentId,
        amount: coinPackage.price * 100, // Convert to paise/cents
        status: "completed",
        currency: "INR",
        plan_name: `${coinPackage.coins} Coins Package`,
        item_type: "coins",
        coins: coinPackage.coins,
        created_at: new Date().toISOString(),
      };
      
      if (orderId) {
        paymentData.order_id = orderId;
      }
      
      if (signature) {
        paymentData.signature = signature;
      }
      
      // Save transaction to database
      const { error: paymentError } = await supabase
        .from("payment_history")
        .insert([paymentData]);
        
      if (paymentError) throw paymentError;
      
      // 2. Add coins to user's balance using profileService for concurrency protection
      const updatedProfile = await profileService.addCoins(userId, coinPackage.coins);
      return {
        success: true,
        profile: updatedProfile,
        transaction: {
          id: paymentId,
          date: new Date().toISOString(),
          description: `Purchased ${coinPackage.coins} coins`,
          amount: coinPackage.price,
          status: "completed"
        }
      };
    } catch (error) {
      throw handleError(error, {
        defaultMessage: 'Failed to process coin purchase'
      }).error ? error : new AppError(
        'Failed to process coin purchase', 
        ErrorTypes.PAYMENT, 
        error
      );
    }
  },
  
  /**
   * Verify that a Razorpay payment is valid
   * @param {Object} paymentData - Payment verification data
   * @returns {Promise<boolean>} Whether the payment is valid
   */
  verifyPayment: async (paymentData) => {
    // In a real implementation, you would verify the payment signature here
    // This would typically involve a server-side call to your payment provider's API
    
    // For now, we'll just return true
    return true;
  },
  
  /**
   * Get payment history for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of payment transactions
   */
  getPaymentHistory: async (userId) => {
    if (!userId) {
      throw new AppError('User ID is required', ErrorTypes.VALIDATION);
    }
    
    try {
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .eq("profile_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Transform data to common transaction format
      return (data || []).map(payment => ({
        id: payment.id,
        date: payment.created_at,
        description: payment.plan_name || "Payment",
        amount: payment.amount / 100, // Convert from paise/cents to whole currency
        status: payment.status,
        paymentId: payment.payment_id,
        orderId: payment.order_id,
        coins: payment.coins
      }));
    } catch (error) {
      throw handleError(error, {
        defaultMessage: 'Failed to fetch payment history'
      }).error ? error : new AppError(
        'Failed to fetch payment history', 
        ErrorTypes.DATABASE, 
        error
      );
    }
  }
};

export default paymentService;
