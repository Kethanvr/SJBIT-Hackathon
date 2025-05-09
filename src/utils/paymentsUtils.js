// Utility functions for payments
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Redeem a referral code for coins. Returns {success, message}.
 * Only accepts code 'KETHANVR' for now.
 */
export async function redeemReferralCodeUtil({ code, user, profile, onProfileUpdate, updateProfile, supabase }) {
  if (!user) {
    return { success: false, message: "Please log in to redeem a code." };
  }
  if (code.trim().toUpperCase() === "KETHANVR") {
    try {
      // Add 10 coins to user's profile
      const newCoins = (profile?.coins || 0) + 10;
      await updateProfile(user.id, { coins: newCoins });
      // Refresh profile
      if (onProfileUpdate) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        onProfileUpdate(profileData);
      }
      return { success: true, message: "Success! 10 coins have been added to your account." };
    } catch (err) {
      return { success: false, message: "Error adding coins. Please try again." };
    }
  } else {
    return { success: false, message: "Invalid referral code. Please try again." };
  }
}
