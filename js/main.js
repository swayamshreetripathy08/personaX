document.addEventListener('DOMContentLoaded', () => {
    // Form Variables
    const form = document.getElementById('persona-form');
    const steps = document.querySelectorAll('.form-step');
    const progress = document.getElementById('form-progress');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const confidenceSlider = document.getElementById('confidence');
    const confidenceVal = document.getElementById('confidence-val');

    // Result Variables
    const formSection = document.getElementById('glow-up-form');
    const dashboardSection = document.getElementById('results-dashboard');

    let currentStep = 0;

    // Initialize Progress Bar
    function updateProgress() {
        const percent = ((currentStep + 1) / steps.length) * 100;
        if (progress) progress.style.width = `${percent}%`;
    }

    // Show Step
    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        updateProgress();
    }

    // Validate inputs in current step
    function validateStep(index) {
        if (!steps[index]) return true;

        const currentStepEl = steps[index];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            if (!input.value) {
                isValid = false;
                input.style.borderColor = '#ef4444'; // Red for error
            }

            if (input.type === 'radio') {
                const name = input.name;
                const checked = currentStepEl.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Next Button Click
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                if (currentStep >= steps.length) currentStep = steps.length - 1;
                showStep(currentStep);
            } else {
                alert("Please fill in all required fields.");
            }
        });
    });

    // Prev Button Click
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            if (currentStep < 0) currentStep = 0;
            showStep(currentStep);
        });
    });

    // Confidence Slider Update
    if (confidenceSlider && confidenceVal) {
        confidenceSlider.addEventListener('input', (e) => {
            confidenceVal.textContent = e.target.value;
        });
    }

    // Form Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                generateResults();
            } else {
                alert("Please fill in all required fields.");
            }
        });
    }

    function generateResults() {
        // Extract Form Data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Mock Generating State
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Analyzing Persona <i class="bx bx-loader-alt bx-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Hide Form, Show Results
            formSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');

            // Populate Mock Results based on input
            populateDashboard(data);

            // Scroll to results
            dashboardSection.scrollIntoView({ behavior: 'smooth' });

            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;

        }, 2000); // 2 second mock delay
    }

    function populateDashboard(data) {
        const bodyType = data.bodyType || "your body type";
        const inspiration = data.fashionInspiration || "your style";
        const colorPref = data.colorPreference || "your favorite colors";
        const skinType = data.skinType || "your skin type";
        const skinConcerns = data.skinConcerns || "concerns";
        const hairType = data.hairType || "your hair type";
        const confidenceScore = parseInt(data.confidence) || 5;

        // 1. Outfit
        const outfitHtml = `
            <p>Based on your <strong>${bodyType}</strong> build and <strong>${inspiration}</strong> preferences, here is your capsule wardrobe starting point:</p>
            <ul>
                <li><strong>Top:</strong> Tailored pieces in ${colorPref} to compliment your frame.</li>
                <li><strong>Bottom:</strong> High-quality, well-fitted trousers/jeans suited for a ${bodyType} shape.</li>
                <li><strong>Layering:</strong> Structured jackets to elevate the aesthetic.</li>
                <li><strong>Accessories:</strong> Minimal jewelry to tie the look together.</li>
            </ul>
        `;
        document.getElementById('result-outfit').innerHTML = outfitHtml;

        // 2. Skincare
        const skincareHtml = `
            <p>To address <strong>${skinConcerns}</strong> with your <strong>${skinType}</strong> skin:</p>
            <ul>
                <li><strong>Morning:</strong> Gentle cleanser, Vitamin C serum, and SPF 50+.</li>
                <li><strong>Evening:</strong> Double cleanse, Hydrating Toner, and a nourishing moisturizer.</li>
                <li><strong>Treatment:</strong> Exfoliate 1-2 times a week with AHA/BHA depending on tolerability.</li>
            </ul>
        `;
        document.getElementById('result-skincare').innerHTML = skincareHtml;

        // 3. Haircare
        const haircareHtml = `
            <p>A customized routine for your <strong>${hairType}</strong> hair:</p>
            <ul>
                <li><strong>Wash Routine:</strong> Sulfate-free shampoo focused on the scalp.</li>
                <li><strong>Hydration:</strong> Deep conditioning treatment tailored for ${data.hairThickness || "your"} hair thickness.</li>
                <li><strong>Styling:</strong> Heat protectant and lightweight styling cream to manage ${data.hairConcerns || "hair concerns"}.</li>
            </ul>
        `;
        document.getElementById('result-haircare').innerHTML = haircareHtml;

        // 4. Confidence
        let confidenceHtml = "";
        if (confidenceScore <= 4) {
            confidenceHtml = `<p>You rated your confidence at a ${confidenceScore}. Remember, true style is about feeling comfortable in your own skin. Start small: wear your favorite outfit tomorrow, stand tall, and acknowledge one thing you love about your appearance.</p>`;
        } else if (confidenceScore <= 7) {
            confidenceHtml = `<p>A solid ${confidenceScore}/10! You have a good foundation. Let's elevate it by taking a slight fashion risk this week—try that color or accessory you've been hesitant about. Own your look!</p>`;
        } else {
            confidenceHtml = `<p>Amazing energy (${confidenceScore}/10)! Use this radiant confidence to inspire others. Your style serves as an extension of your bold personality.</p>`;
        }
        document.getElementById('result-confidence').innerHTML = confidenceHtml;

        // 5. Calculate final Glow Score
        const glowScoreAnim = document.getElementById('final-glow-score');
        let currentScore = 0;
        const targetScore = Math.floor(Math.random() * (98 - 75 + 1) + 75);

        const interval = setInterval(() => {
            currentScore += 2;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(interval);
            }
            if (glowScoreAnim) glowScoreAnim.textContent = currentScore;
        }, 30);
    }
});
