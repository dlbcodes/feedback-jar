(function () {
    "use strict";

    // --- CONFIGURATION ---
    const currentScript =
        document.currentScript ||
        document.querySelector('script[src*="feedbackjar.js"]');

    const CONFIG = {
        apiEndpoint: currentScript?.getAttribute("data-api-endpoint") || "",
        typesEndpoint: currentScript?.getAttribute("data-types-endpoint") || "",
        routeMessagesEndpoint:
            currentScript?.getAttribute("data-route-messages-endpoint") || "",
        scriptKey: currentScript?.getAttribute("data-script-key") || "",
        position:
            currentScript?.getAttribute("data-position") || "bottom-right",
    };

    // --- STYLES ---
    const styles = `
    /* --- Original Widget Styles --- */
    .feedback-widget-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f39f6 0%, #4f39f6 100%);
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
    .feedback-widget-btn.has-notification::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      background: #ef4444;
      border: 2px solid white;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .feedback-widget-btn svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    /* --- Modal & Form Styles --- */
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
    .feedback-widget-modal.active { display: flex; }
    
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
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
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
    .feedback-widget-close:hover { background: #f3f4f6; }
    .feedback-widget-body { padding: 24px; }
    
    /* Options Grid */
    .feedback-widget-options { display: grid; gap: 12px; margin-bottom: 20px; }
    .feedback-widget-loading { text-align: center; padding: 20px; color: #6b7280; font-family: sans-serif; }
    .feedback-option-btn {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      font-family: sans-serif;
    }
    .feedback-option-btn:hover { border-color: #667eea; background: #f8f9ff; }
    .feedback-option-title { font-weight: 600; font-size: 15px; color: #1f2937; margin-bottom: 4px; }
    
    /* Form Elements */
    .feedback-widget-form { display: none; }
    .feedback-widget-form.active { display: block; }
    .feedback-form-group { margin-bottom: 16px; }
    .feedback-form-label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px; font-family: sans-serif; }
    .feedback-form-input, .feedback-form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: sans-serif;
      box-sizing: border-box;
    }
    .feedback-form-textarea { resize: vertical; min-height: 100px; }
    .feedback-form-actions { display: flex; gap: 12px; margin-top: 20px; }
    .feedback-btn {
      flex: 1; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: sans-serif;
    }
    .feedback-btn-primary { background: #4f39f6; color: white; border: none; }
    .feedback-btn-primary:hover { background: #4338ca; }
    .feedback-btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .feedback-btn-secondary { background: white; color: #374151; border: 1px solid #d1d5db; }
    .feedback-btn-secondary:hover { background: #f9fafb; }
    
    /* Success/Error States */
    .feedback-widget-success, .feedback-error { display: none; text-align: center; padding: 40px 24px; }
    .feedback-widget-success.active, .feedback-error.active { display: block; }
    .feedback-success-icon, .feedback-error-icon {
      width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
    .feedback-success-icon { background: #10b981; }
    .feedback-error-icon { background: #ef4444; color: white; font-size: 32px; }
    .feedback-success-icon svg { width: 32px; height: 32px; fill: white; }
    .feedback-success-title, .feedback-error-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px; font-family: sans-serif; }
    .feedback-success-message, .feedback-error-message { font-size: 14px; color: #6b7280; font-family: sans-serif; }

    /* --- NEW ENHANCED DISPLAY STYLES --- */
    
    /* Banner style */
    .feedback-route-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 999998;
      animation: slideDown 0.3s ease;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    
    /* Toast style */
    .feedback-route-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 360px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 999998;
      animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    /* Modal style (Route Message) */
    .feedback-route-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 999999;
      animation: fadeScale 0.2s ease;
    }
    @keyframes fadeScale {
        from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .feedback-route-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 999998;
    }
    
    /* Popover style (Enhanced) */
    .feedback-route-popover {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      z-index: 999998;
      animation: slideIn 0.3s ease;
    }
    .feedback-route-popover::after {
      content: '';
      position: absolute;
      bottom: -8px;
      right: 24px;
      width: 16px;
      height: 16px;
      background: white;
      transform: rotate(45deg);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Shared Header/Body styles for route messages */
    .feedback-popover-header {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-radius: 12px 12px 0 0;
      background: inherit;
    }
    .feedback-popover-body {
      padding: 16px;
      border-radius: 0 0 12px 12px;
      background: inherit;
    }
    .feedback-popover-title {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      color: inherit;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .feedback-popover-icon {
      font-size: 24px;
      margin-right: 12px;
    }
    .feedback-popover-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }
    .feedback-popover-close:hover { opacity: 1; }
    
    .feedback-popover-cta {
      width: 100%;
      padding: 10px 16px;
      background: #4f39f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin-top: 12px;
      text-align: center;
      text-decoration: none;
      display: block;
      box-sizing: border-box;
    }
    .feedback-popover-cta:hover { background: #4338ca; color: white;}

    /* HTML Content Styling */
    .feedback-html-content {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      font-size: 14px;
      color: inherit;
    }
    .feedback-html-content h1, .feedback-html-content h2, .feedback-html-content h3 { margin: 0 0 8px 0; font-weight: 600; font-size: 16px; }
    .feedback-html-content p { margin: 0 0 12px 0; }
    .feedback-html-content a { color: #4f39f6; text-decoration: none; }
    .feedback-html-content a:hover { text-decoration: underline; }
    .feedback-html-content ul, .feedback-html-content ol { margin: 0 0 12px 0; padding-left: 20px; }
    .feedback-html-content img { max-width: 100%; height: auto; border-radius: 4px; }
  `;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // --- DOM GENERATION (Static Widget) ---
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
          <div class="feedback-widget-loading" id="feedbackLoading">Loading options...</div>
          <div class="feedback-widget-options" id="feedbackOptions" style="display: none;"></div>
          
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
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </div>
            <div class="feedback-success-title">Thank you!</div>
            <div class="feedback-success-message">We've received your message and will get back to you soon.</div>
          </div>
          
          <div class="feedback-error" id="feedbackError">
            <div class="feedback-error-icon">⚠</div>
            <div class="feedback-error-title">Oops!</div>
            <div class="feedback-error-message">Failed to load feedback options. Please try again later.</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="feedbackRouteMessageContainer"></div>
  `;

    const widgetContainer = document.createElement("div");
    widgetContainer.innerHTML = widgetHTML;
    document.body.appendChild(widgetContainer);

    // --- ELEMENTS ---
    const btn = document.getElementById("feedbackWidgetBtn");
    const modal = document.getElementById("feedbackModal");
    const closeBtn = document.getElementById("feedbackClose");
    const loading = document.getElementById("feedbackLoading");
    const options = document.getElementById("feedbackOptions");
    const form = document.getElementById("feedbackForm");
    const success = document.getElementById("feedbackSuccess");
    const error = document.getElementById("feedbackError");
    const backBtn = document.getElementById("feedbackBack");
    const submitBtn = document.getElementById("feedbackSubmit");
    const emailInput = document.getElementById("feedbackEmail");
    const messageInput = document.getElementById("feedbackMessage");
    const title = document.getElementById("feedbackTitle");
    const routeMessageContainer = document.getElementById(
        "feedbackRouteMessageContainer"
    );

    // --- STATE ---
    let selectedType = null;
    let feedbackTypes = [];
    let typesLoaded = false;
    let routeMessages = [];
    let dismissedRoutes = new Set();
    let currentPath = window.location.pathname;
    let currentActiveMessageElement = null;

    // --- HELPER FUNCTIONS ---

    function escapeHtml(unsafe) {
        if (!unsafe) return "";
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderCTA(message) {
        if (!message.ctaText) return "";

        // If it's a link action
        if (message.ctaAction === "link" && message.ctaUrl) {
            return `<a href="${
                message.ctaUrl
            }" class="feedback-popover-cta" target="_blank">${escapeHtml(
                message.ctaText
            )}</a>`;
        }

        // Default: Open feedback widget
        return `<button class="feedback-popover-cta" data-action="open-widget">${escapeHtml(
            message.ctaText
        )}</button>`;
    }

    // --- ENHANCED ROUTE MESSAGE RENDERING ---

    function renderRouteMessage(message) {
        const displayType = message.displayType || "popover";
        const messageContent =
            message.messageType === "html" && message.messageHtml
                ? message.messageHtml
                : `<p>${escapeHtml(message.message)}</p>`;

        // Apply custom theme if provided
        let themeStyles = "";
        if (message.theme) {
            const bg = message.theme.backgroundColor || "white";
            const color = message.theme.textColor || "#1f2937";
            themeStyles = `background: ${bg}; color: ${color};`;
        }

        let html = "";

        // Structure HTML based on type
        switch (displayType) {
            case "banner":
                html = `
            <div class="feedback-route-banner" style="${themeStyles}">
              <div class="feedback-html-content" style="flex:1; margin-right: 16px;">${messageContent}</div>
              <div style="display:flex; align-items:center; gap:12px;">
                ${
                    message.ctaText
                        ? renderCTA(message).replace(
                              "feedback-popover-cta",
                              "feedback-popover-cta style-banner"
                          )
                        : ""
                }
                ${
                    message.dismissable
                        ? '<button class="feedback-popover-close" data-dismiss>&times;</button>'
                        : ""
                }
              </div>
            </div>`;
                break;

            case "toast":
                html = `
            <div class="feedback-route-toast" style="${themeStyles}">
              <div class="feedback-popover-header">
                <h3 class="feedback-popover-title">${escapeHtml(
                    message.title || "Notification"
                )}</h3>
                ${
                    message.dismissable
                        ? '<button class="feedback-popover-close" data-dismiss>&times;</button>'
                        : ""
                }
              </div>
              <div class="feedback-popover-body">
                <div class="feedback-html-content">${messageContent}</div>
                ${renderCTA(message)}
              </div>
            </div>`;
                break;

            case "modal":
                html = `
            <div class="feedback-wrapper">
              <div class="feedback-route-modal-backdrop" data-dismiss></div>
              <div class="feedback-route-modal" style="${themeStyles}">
                <div class="feedback-popover-header">
                  <h3 class="feedback-popover-title">${escapeHtml(
                      message.title || "Important"
                  )}</h3>
                  ${
                      message.dismissable
                          ? '<button class="feedback-popover-close" data-dismiss>&times;</button>'
                          : ""
                  }
                </div>
                <div class="feedback-popover-body">
                  <div class="feedback-html-content">${messageContent}</div>
                  ${renderCTA(message)}
                </div>
              </div>
            </div>`;
                break;

            default: // popover
                html = `
            <div class="feedback-route-popover" style="${themeStyles}">
              <div class="feedback-popover-header">
                <div style="display: flex; align-items: center; flex: 1;">
                  <span class="feedback-popover-icon">${
                      message.emoji || "💬"
                  }</span>
                  <h3 class="feedback-popover-title">${escapeHtml(
                      message.title || "Quick tip"
                  )}</h3>
                </div>
                ${
                    message.dismissable
                        ? '<button class="feedback-popover-close" data-dismiss>&times;</button>'
                        : ""
                }
              </div>
              <div class="feedback-popover-body">
                <div class="feedback-html-content">${messageContent}</div>
                ${renderCTA(message)}
              </div>
            </div>`;
                break;
        }

        return html;
    }

    function showRouteMessage(message) {
        // Clear existing message
        if (currentActiveMessageElement) {
            currentActiveMessageElement.remove();
            currentActiveMessageElement = null;
        }

        const html = renderRouteMessage(message);
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        currentActiveMessageElement = wrapper.firstElementChild;

        // If modal, we might have a wrapper with backdrop and modal
        if (message.displayType === "modal") {
            currentActiveMessageElement = wrapper;
        }

        routeMessageContainer.appendChild(currentActiveMessageElement);

        // Specific behavior for Popover (attach to button)
        if (!message.displayType || message.displayType === "popover") {
            btn.classList.add("has-notification");
        }

        // Attach Event Listeners to the new dynamic element
        const newEl = currentActiveMessageElement;

        // 1. Dismiss buttons
        const dismissBtns = newEl.querySelectorAll("[data-dismiss]");
        dismissBtns.forEach((b) => {
            b.addEventListener("click", (e) => {
                e.stopPropagation();
                hideRouteMessage();
            });
        });

        // 2. CTA Buttons (specifically the Open Widget ones)
        const openWidgetBtns = newEl.querySelectorAll(
            '[data-action="open-widget"]'
        );
        openWidgetBtns.forEach((b) => {
            b.addEventListener("click", () => {
                hideRouteMessage();
                openMainModal();
            });
        });
    }

    function hideRouteMessage() {
        if (currentActiveMessageElement) {
            currentActiveMessageElement.remove();
            currentActiveMessageElement = null;
        }
        btn.classList.remove("has-notification");
        dismissedRoutes.add(window.location.pathname);
    }

    // --- ORIGINAL UTILITY FUNCTIONS ---

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
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
            return "tablet";
        if (
            /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        )
            return "mobile";
        return "desktop";
    }

    async function captureScreenshot() {
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
            return { country: "Unknown", region: "Unknown" };
        }
    }

    // --- DATA LOADING ---

    async function loadFeedbackTypes() {
        try {
            const typesUrl = `${CONFIG.typesEndpoint}?script_key=${CONFIG.scriptKey}`;
            const typesResponse = await fetch(typesUrl);
            if (!typesResponse.ok)
                throw new Error("Failed to load feedback types");
            const typesData = await typesResponse.json();
            feedbackTypes = typesData.types || [];
            renderFeedbackOptions();
            loading.style.display = "none";
            options.style.display = "grid";
            typesLoaded = true;
        } catch (err) {
            console.error("Error loading feedback types:", err);
            loading.style.display = "none";
            error.classList.add("active");
        }
    }

    async function loadRouteMessages() {
        if (!CONFIG.routeMessagesEndpoint) return;
        try {
            const url = `${CONFIG.routeMessagesEndpoint}?script_key=${CONFIG.scriptKey}`;
            const response = await fetch(url);
            if (!response.ok) return;
            const data = await response.json();
            if (data.messages && data.messages.length > 0) {
                routeMessages = data.messages;
                checkRouteMatch();
            }
        } catch (err) {
            console.error("Error loading route messages:", err);
        }
    }

    function checkRouteMatch() {
        const path = window.location.pathname;
        if (dismissedRoutes.has(path)) return;

        // Remove any existing message if navigating to a new route that doesn't match
        if (currentActiveMessageElement) {
            const currentMessage = routeMessages.find((m) =>
                matchRoute(m, currentPath)
            );
            const newMessage = routeMessages.find((m) => matchRoute(m, path));
            if (!newMessage || newMessage !== currentMessage) {
                hideRouteMessage();
            }
        }

        for (const routeMsg of routeMessages) {
            if (matchRoute(routeMsg, path)) {
                // Add delay for better UX
                setTimeout(() => showRouteMessage(routeMsg), 1000);
                break;
            }
        }
    }

    function matchRoute(routeMsg, path) {
        switch (routeMsg.matchType) {
            case "exact":
                return path === routeMsg.route;
            case "startsWith":
                return path.startsWith(routeMsg.route);
            case "contains":
                return path.includes(routeMsg.route);
            default:
                return false;
        }
    }

    // --- WIDGET INTERACTION ---

    function renderFeedbackOptions() {
        options.innerHTML = "";
        feedbackTypes.forEach((type) => {
            const btn = document.createElement("button");
            btn.className = "feedback-option-btn";
            btn.dataset.type = type.name;
            const emoji = type.emoji || getDefaultEmoji(type.name);
            btn.innerHTML = `<div class="feedback-option-title">${emoji} ${type.label}</div>`;
            btn.addEventListener("click", () => {
                selectedType = type.name;
                title.textContent = type.label;
                options.style.display = "none";
                form.classList.add("active");
            });
            options.appendChild(btn);
        });
    }

    function getDefaultEmoji(typeName) {
        const emojiMap = {
            bug: "🐛",
            feedback: "💡",
            help: "❓",
            feature: "✨",
            improvement: "🚀",
            question: "❓",
        };
        return emojiMap[typeName.toLowerCase()] || "💬";
    }

    function openMainModal() {
        modal.classList.add("active");
        if (!typesLoaded) loadFeedbackTypes();
    }

    // --- EVENT HANDLERS ---

    btn.addEventListener("click", () => {
        // If there's a popover/message active, hide it when opening the main widget
        if (currentActiveMessageElement) hideRouteMessage();
        openMainModal();
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
        if (typesLoaded) {
            loading.style.display = "none";
            options.style.display = "grid";
        } else {
            loading.style.display = "block";
            options.style.display = "none";
        }
        form.classList.remove("active");
        success.classList.remove("active");
        error.classList.remove("active");
        title.textContent = "How can we help?";
        emailInput.value = "";
        messageInput.value = "";
        selectedType = null;
    }

    backBtn.addEventListener("click", () => {
        form.classList.remove("active");
        options.style.display = "grid";
        title.textContent = "How can we help?";
    });

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
                user_id: null,
                metadata: {
                    country: location.country,
                    region: location.region,
                },
                custom_fields: { type: selectedType },
            };

            const response = await fetch(CONFIG.apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                form.classList.remove("active");
                success.classList.add("active");
                setTimeout(() => closeModal(), 3000);
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

    // Watch for route changes (SPA support)
    let lastPath = currentPath;
    setInterval(() => {
        const newPath = window.location.pathname;
        if (newPath !== lastPath) {
            lastPath = newPath;
            currentPath = newPath;
            checkRouteMatch();
        }
    }, 500);

    // Initialize
    loadRouteMessages();
    loadFeedbackTypes();
})();
