import { useState } from "react";
import { FiGift, FiLoader } from "react-icons/fi";

/**
 * ReferralCodeCard component for redeeming referral codes for coins.
 * Props:
 *   user: current user object
 *   profile: current profile object
 *   onProfileUpdate: callback to refresh profile after successful redemption
 *   redeemReferralCode: async function to handle code redemption
 */
export default function ReferralCodeCard({ user, profile, onProfileUpdate, redeemReferralCode }) {
  const [referralCode, setReferralCode] = useState("");
  const [redeemingCode, setRedeemingCode] = useState(false);
  const [referralMessage, setReferralMessage] = useState("");

  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeemingCode(true);
    setReferralMessage("");
    const { success, message } = await redeemReferralCode({
      code: referralCode,
      user,
      profile,
      onProfileUpdate,
    });
    setReferralMessage(message);
    setRedeemingCode(false);
    setReferralCode("");
  };  return (
    <div className="border-t">
      <div className="p-4 sm:p-5">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiGift className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Got a referral code?</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Enter your code to get 10 free coins!</p>
          </div>
        </div>        <form onSubmit={handleRedeem} className="mt-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full sm:flex-1 border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={!referralCode || redeemingCode}
              className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {redeemingCode ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin mr-2" />
                  Redeeming...
                </>
              ) : (
                'Redeem'
              )}
            </button>
          </div>          {referralMessage && (
            <div className={`mt-3 sm:mt-4 text-xs sm:text-sm ${String(referralMessage).startsWith('Success') ? 'text-green-600' : 'text-red-600'}`}>
              {String(referralMessage)} {/* Ensure message is treated as a string */}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
