document.addEventListener('DOMContentLoaded', () => {
    const otpLoginForm = document.getElementById('otp-login-form');
    const mobileNumberInput = document.getElementById('mobile-number');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const sendOtpSpinner = document.getElementById('send-otp-spinner');
    const otpSection = document.getElementById('otp-section');
    const displayMobileNumber = document.getElementById('display-mobile-number');
    const otpCodeInput = document.getElementById('otp-code');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const verifyOtpSpinner = document.getElementById('verify-otp-spinner');
    const resendOtpBtn = document.getElementById('resend-otp-btn');
    const resendTimer = document.getElementById('resend-timer');
    const mobileError = document.getElementById('mobile-error');
    const otpError = document.getElementById('otp-error');
    const name = localStorage.getItem("driverName");
if (name) {
  document.getElementById("dashboardDriverName").textContent = name;
}

    let resendTimeout;
    const RESEND_TIMER_DURATION = 60; // seconds

    // --- Mobile Number Input Handling ---
    mobileNumberInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, ''); // Allow only digits
        if (this.value.length === 10) {
            mobileError.textContent = ''; // Clear error on valid length
            sendOtpBtn.removeAttribute('disabled');
        } else {
            mobileError.textContent = 'Please enter a 10-digit mobile number.';
            sendOtpBtn.setAttribute('disabled', 'true');
        }
    });

    // --- Send OTP Logic ---
    sendOtpBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default form submission for initial click

        const mobileNumber = mobileNumberInput.value;
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            mobileError.textContent = 'Please enter a valid 10-digit mobile number.';
            return;
        }

        // Show loading state
        sendOtpBtn.classList.add('loading');
        sendOtpBtn.setAttribute('disabled', 'true');
        mobileError.textContent = '';
        otpError.textContent = ''; // Clear any previous OTP errors

        try {
            // *** Replace with your actual API call to send OTP ***
            console.log(`Sending OTP to: ${mobileNumber}`);
            // Simulate API call
            const response = await new Promise(resolve => setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate for demo
                resolve({ success: success, message: success ? 'OTP sent successfully!' : 'Failed to send OTP. Please try again.' });
            }, 1500));

            if (response.success) {
                displayMobileNumber.textContent = mobileNumber;
                otpSection.classList.remove('hidden');
                otpCodeInput.focus(); // Auto-focus OTP input
                startResendTimer();
                // Optionally, disable mobile number input after OTP is sent
                mobileNumberInput.setAttribute('readonly', 'true');
                sendOtpBtn.classList.add('hidden'); // Hide "Send OTP" button
            } else {
                mobileError.textContent = response.message || 'Something went wrong. Please try again.';
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            mobileError.textContent = 'Network error. Please check your connection.';
        } finally {
            // Hide loading state
            sendOtpBtn.classList.remove('loading');
            if (!otpSection.classList.contains('hidden')) {
                sendOtpBtn.setAttribute('disabled', 'true'); // Keep disabled if OTP section is shown
            } else {
                sendOtpBtn.removeAttribute('disabled'); // Re-enable if OTP section not shown
            }
        }
    });

    // --- Verify OTP Logic ---
    verifyOtpBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const mobileNumber = mobileNumberInput.value;
        const otpCode = otpCodeInput.value;

        if (!/^[0-9]{6}$/.test(otpCode)) {
            otpError.textContent = 'Please enter a 6-digit OTP.';
            return;
        }

        // Show loading state
        verifyOtpBtn.classList.add('loading');
        verifyOtpBtn.setAttribute('disabled', 'true');
        otpError.textContent = '';

        try {
            // *** Replace with your actual API call to verify OTP ***
            console.log(`Verifying OTP: ${otpCode} for ${mobileNumber}`);
            // Simulate API call
            const response = await new Promise(resolve => setTimeout(() => {
                const success = Math.random() > 0.3; // 70% success rate for demo
                resolve({ success: success, message: success ? 'Login successful!' : 'Invalid OTP. Please try again.' });
            }, 1500));

            if (response.success) {
                alert('Login Successful!'); // Replace with actual redirection
                window.location.href = '/dashboard'; // Redirect to dashboard
            } else {
                otpError.textContent = response.message || 'Incorrect OTP. Please try again.';
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            otpError.textContent = 'Network error during verification.';
        } finally {
            // Hide loading state
            verifyOtpBtn.classList.remove('loading');
            verifyOtpBtn.removeAttribute('disabled');
        }
    });

    // --- Resend OTP Logic ---
    resendOtpBtn.addEventListener('click', async () => {
        resendOtpBtn.setAttribute('disabled', 'true');
        resendTimer.textContent = ''; // Clear timer text temporarily

        const mobileNumber = mobileNumberInput.value;
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            mobileError.textContent = 'Invalid mobile number to resend OTP.';
            return;
        }

        try {
            // *** Replace with your actual API call to resend OTP ***
            console.log(`Resending OTP to: ${mobileNumber}`);
            const response = await new Promise(resolve => setTimeout(() => {
                const success = Math.random() > 0.2; // 80% success for demo
                resolve({ success: success, message: success ? 'New OTP sent!' : 'Failed to resend OTP.' });
            }, 1000));

            if (response.success) {
                alert('New OTP has been sent.'); // Or show a success message below OTP input
                otpError.textContent = ''; // Clear previous error
                startResendTimer();
            } else {
                otpError.textContent = response.message || 'Could not resend OTP.';
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            otpError.textContent = 'Network error while resending.';
        }
    });

    // --- Resend Timer Functionality ---
    function startResendTimer() {
        let timeLeft = RESEND_TIMER_DURATION;
        resendOtpBtn.setAttribute('disabled', 'true');
        resendOtpBtn.style.cursor = 'not-allowed';
        resendTimer.classList.remove('hidden');

        resendTimeout = setInterval(() => {
            if (timeLeft > 0) {
                resendTimer.textContent = `Resend in ${timeLeft}s`;
                timeLeft--;
            } else {
                clearInterval(resendTimeout);
                resendTimer.textContent = '';
                resendOtpBtn.removeAttribute('disabled');
                resendOtpBtn.style.cursor = 'pointer';
            }
        }, 1000);
    }

    // Initial state: Send OTP button disabled if mobile number is not 10 digits
    if (mobileNumberInput.value.length !== 10) {
        sendOtpBtn.setAttribute('disabled', 'true');
        mobileError.textContent = 'Please enter a 10-digit mobile number.';
    }
});