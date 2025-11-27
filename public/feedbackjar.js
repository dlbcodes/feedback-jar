(function () {
    "use strict";

    // Configuration
    const CONFIG = {
        apiEndpoint: "http://localhost:3000/api/v1/feedback", // Replace with your API endpoint
        scriptKey: "cmih915qu00050z84sdjhg3ly", // Replace with your actual script key
        position: "bottom-right", // Options: bottom-right, bottom-left, top-right, top-left
    };

    // Create styles
    const styles = `
    .feedback-widget-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feedback-widget-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    .feedback-widget-btn svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    .feedback-widget-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000000;
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }
    .feedback-widget-modal.active {
      display: flex;
    }
    .feedback-widget-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .feedback-widget-header {
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .feedback-widget-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .feedback-widget-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .feedback-widget-close:hover {
      background: #f3f4f6;
    }
    .feedback-widget-body {
      padding: 24px;
    }
    .feedback-widget-options {
      display: grid;
      gap: 12px;
      margin-bottom: 20px;
    }
    .feedback-option-btn {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .feedback-option-btn:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }
    .feedback-option-btn.selected {
      border-color: #667eea;
      background: #f0f3ff;
    }
    .feedback-option-title {
      font-weight: 600;
      font-size: 15px;
      color: #1f2937;
      margin-bottom: 4px;
    }
    .feedback-option-desc {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }
    .feedback-widget-form {
      display: none;
    }
    .feedback-widget-form.active {
      display: block;
    }
    .feedback-form-group {
      margin-bottom: 16px;
    }
    .feedback-form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .feedback-form-input,
    .feedback-form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .feedback-form-input:focus,
    .feedback-form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .feedback-form-textarea {
      resize: vertical;
      min-height: 100px;
    }
    .feedback-form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    .feedback-btn {
      flex: 1;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .feedback-btn-primary {
      background: #667eea;
      color: white;
      border: none;
    }
    .feedback-btn-primary:hover {
      background: #5568d3;
    }
    .feedback-btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    .feedback-btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .feedback-btn-secondary:hover {
      background: #f9fafb;
    }
    .feedback-widget-success {
      display: none;
      text-align: center;
      padding: 40px 24px;
    }
    .feedback-widget-success.active {
      display: block;
    }
    .feedback-success-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .feedback-success-icon svg {
      width: 32px;
      height: 32px;
      fill: white;
    }
    .feedback-success-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .feedback-success-message {
      font-size: 14px;
      color: #6b7280;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  `;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create widget HTML
    const widgetHTML = `
    <button class="feedback-widget-btn" id="feedbackWidgetBtn">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </button>
    <div class="feedback-widget-modal" id="feedbackModal">
      <div class="feedback-widget-content">
        <div class="feedback-widget-header">
          <h2 id="feedbackTitle">How can we help?</h2>
          <button class="feedback-widget-close" id="feedbackClose">&times;</button>
        </div>
        <div class="feedback-widget-body">
          <div class="feedback-widget-options" id="feedbackOptions">
            <button class="feedback-option-btn" data-type="bug">
              <div class="feedback-option-title">🐛 Report a Bug</div>
              <p class="feedback-option-desc">Something isn't working as expected</p>
            </button>
            <button class="feedback-option-btn" data-type="feedback">
              <div class="feedback-option-title">💡 Give Feedback</div>
              <p class="feedback-option-desc">Share your thoughts and ideas</p>
            </button>
            <button class="feedback-option-btn" data-type="help">
              <div class="feedback-option-title">❓ Ask for Help</div>
              <p class="feedback-option-desc">Get assistance with something</p>
            </button>
          </div>
          <div class="feedback-widget-form" id="feedbackForm">
            <div class="feedback-form-group">
              <label class="feedback-form-label">Your Email</label>
              <input type="email" class="feedback-form-input" id="feedbackEmail" placeholder="you@example.com" required>
            </div>
            <div class="feedback-form-group">
              <label class="feedback-form-label">Message</label>
              <textarea class="feedback-form-textarea" id="feedbackMessage" placeholder="Tell us more..." required></textarea>
            </div>
            <div class="feedback-form-actions">
              <button class="feedback-btn feedback-btn-secondary" id="feedbackBack">Back</button>
              <button class="feedback-btn feedback-btn-primary" id="feedbackSubmit">Send</button>
            </div>
          </div>
          <div class="feedback-widget-success" id="feedbackSuccess">
            <div class="feedback-success-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div class="feedback-success-title">Thank you!</div>
            <div class="feedback-success-message">We've received your message and will get back to you soon.</div>
          </div>
        </div>
      </div>
    </div>
  `;

    // Insert widget into page
    const widgetContainer = document.createElement("div");
    widgetContainer.innerHTML = widgetHTML;
    document.body.appendChild(widgetContainer);

    // Get elements
    const btn = document.getElementById("feedbackWidgetBtn");
    const modal = document.getElementById("feedbackModal");
    const closeBtn = document.getElementById("feedbackClose");
    const options = document.getElementById("feedbackOptions");
    const form = document.getElementById("feedbackForm");
    const success = document.getElementById("feedbackSuccess");
    const backBtn = document.getElementById("feedbackBack");
    const submitBtn = document.getElementById("feedbackSubmit");
    const emailInput = document.getElementById("feedbackEmail");
    const messageInput = document.getElementById("feedbackMessage");
    const title = document.getElementById("feedbackTitle");

    let selectedType = null;

    // Utility functions
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        let version = "Unknown";

        if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
            browser = "Chrome";
            version = ua.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
        } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
            browser = "Safari";
            version = ua.match(/Version\/(\d+)/)?.[1] || "Unknown";
        } else if (ua.indexOf("Firefox") > -1) {
            browser = "Firefox";
            version = ua.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
        } else if (ua.indexOf("Edg") > -1) {
            browser = "Edge";
            version = ua.match(/Edg\/(\d+)/)?.[1] || "Unknown";
        }

        return { browser, version };
    }

    function getOS() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Win") > -1) return "Windows";
        if (ua.indexOf("Mac") > -1) return "macOS";
        if (ua.indexOf("Linux") > -1) return "Linux";
        if (ua.indexOf("Android") > -1) return "Android";
        if (ua.indexOf("iOS") > -1) return "iOS";
        return "Unknown";
    }

    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (
            /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return "mobile";
        }
        return "desktop";
    }

    async function captureScreenshot() {
        // This is a placeholder - actual screenshot would require a library like html2canvas
        // For now, we'll return null
        return null;
    }

    function generateSessionId() {
        return (
            "session_" +
            Math.random().toString(36).substr(2, 9) +
            Date.now().toString(36)
        );
    }

    async function getUserLocation() {
        try {
            const response = await fetch("https://ipapi.co/json/");
            const data = await response.json();
            return {
                country: data.country_name || "Unknown",
                region: data.region || "Unknown",
            };
        } catch (error) {
            return {
                country: "Unknown",
                region: "Unknown",
            };
        }
    }

    // Event handlers
    btn.addEventListener("click", () => {
        modal.classList.add("active");
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove("active");
        setTimeout(resetWidget, 300);
    }

    function resetWidget() {
        options.style.display = "grid";
        form.classList.remove("active");
        success.classList.remove("active");
        title.textContent = "How can we help?";
        emailInput.value = "";
        messageInput.value = "";
        selectedType = null;
        document.querySelectorAll(".feedback-option-btn").forEach((btn) => {
            btn.classList.remove("selected");
        });
    }

    // Option selection
    document.querySelectorAll(".feedback-option-btn").forEach((optionBtn) => {
        optionBtn.addEventListener("click", () => {
            selectedType = optionBtn.dataset.type;

            const titles = {
                bug: "Report a Bug",
                feedback: "Give Feedback",
                help: "Ask for Help",
            };

            title.textContent = titles[selectedType];
            options.style.display = "none";
            form.classList.add("active");
        });
    });

    backBtn.addEventListener("click", () => {
        form.classList.remove("active");
        options.style.display = "grid";
        title.textContent = "How can we help?";
    });

    // Form submission
    submitBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!email || !message) {
            alert("Please fill in all fields");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
            const browserInfo = getBrowserInfo();
            const location = await getUserLocation();
            const screenshot = await captureScreenshot();

            const payload = {
                script_key: CONFIG.scriptKey,
                message: message,
                email: email,
                screenshot_url: screenshot,
                page_url: window.location.href,
                browser: browserInfo.browser,
                browser_version: browserInfo.version,
                os: getOS(),
                device_type: getDeviceType(),
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight,
                device_pixel_ratio: window.devicePixelRatio,
                user_agent: navigator.userAgent,
                session_id: generateSessionId(),
                user_id: null, // You can set this if you have user tracking
                metadata: {
                    country: location.country,
                    region: location.region,
                },
                custom_fields: {
                    type: selectedType,
                },
            };

            const response = await fetch(CONFIG.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                form.classList.remove("active");
                success.classList.add("active");

                setTimeout(() => {
                    closeModal();
                }, 3000);
            } else {
                throw new Error("Failed to submit feedback");
            }
        } catch (error) {
            console.error("Feedback submission error:", error);
            alert("Failed to send feedback. Please try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
        }
    });
})();
