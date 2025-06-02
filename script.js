// Communication Overload Assessment Tool
// Interactive functionality and assessment logic

// Assessment Questions Data
const assessmentQuestions = [
    {
        id: 'q1',
        category: 'volume',
        question: 'How many work-related messages (emails, chats, texts) do you receive per day?',
        options: [
            { value: 1, text: 'Less than 20 messages' },
            { value: 2, text: '20-50 messages' },
            { value: 3, text: '51-100 messages' },
            { value: 4, text: 'More than 100 messages' }
        ]
    },
    {
        id: 'q2',
        category: 'interruption',
        question: 'How often do notifications interrupt your focused work?',
        options: [
            { value: 1, text: 'Rarely (few times a day)' },
            { value: 2, text: 'Sometimes (every few hours)' },
            { value: 3, text: 'Often (every hour)' },
            { value: 4, text: 'Constantly (every few minutes)' }
        ]
    },
    {
        id: 'q3',
        category: 'pressure',
        question: 'Do you feel pressure to respond to work messages immediately?',
        options: [
            { value: 1, text: 'Never - I respond when convenient' },
            { value: 2, text: 'Rarely - Usually within a few hours' },
            { value: 3, text: 'Often - Usually within 30 minutes' },
            { value: 4, text: 'Always - I must respond immediately' }
        ]
    },
    {
        id: 'q4',
        category: 'channels',
        question: 'How many different communication platforms do you use for work daily?',
        options: [
            { value: 1, text: '1-2 platforms (e.g., email + one chat app)' },
            { value: 2, text: '3-4 platforms' },
            { value: 3, text: '5-6 platforms' },
            { value: 4, text: '7+ platforms' }
        ]
    },
    {
        id: 'q5',
        category: 'meetings',
        question: 'How much of your workday is spent in meetings or video calls?',
        options: [
            { value: 1, text: 'Less than 2 hours per day' },
            { value: 2, text: '2-4 hours per day' },
            { value: 3, text: '4-6 hours per day' },
            { value: 4, text: 'More than 6 hours per day' }
        ]
    },
    {
        id: 'q6',
        category: 'focus',
        question: 'How often can you work for 2+ hours without communication interruptions?',
        options: [
            { value: 4, text: 'Never - Always interrupted' },
            { value: 3, text: 'Rarely - Maybe once a week' },
            { value: 2, text: 'Sometimes - Few times a week' },
            { value: 1, text: 'Often - Daily or multiple times daily' }
        ]
    },
    {
        id: 'q7',
        category: 'stress',
        question: 'How stressed do you feel about keeping up with work communications?',
        options: [
            { value: 1, text: 'Not stressed - Very manageable' },
            { value: 2, text: 'Slightly stressed - Mostly manageable' },
            { value: 3, text: 'Moderately stressed - Often overwhelming' },
            { value: 4, text: 'Very stressed - Constantly overwhelming' }
        ]
    },
    {
        id: 'q8',
        category: 'afterhours',
        question: 'How often do you check work communications outside business hours?',
        options: [
            { value: 1, text: 'Never - Strict work-life boundaries' },
            { value: 2, text: 'Rarely - Only for emergencies' },
            { value: 3, text: 'Often - Several times per evening/weekend' },
            { value: 4, text: 'Constantly - Always monitoring' }
        ]
    },
    {
        id: 'q9',
        category: 'productivity',
        question: 'How much does communication overload impact your ability to complete important tasks?',
        options: [
            { value: 1, text: 'No impact - I stay focused on priorities' },
            { value: 2, text: 'Minor impact - Occasionally delays tasks' },
            { value: 3, text: 'Moderate impact - Regularly delays tasks' },
            { value: 4, text: 'Major impact - Prevents task completion' }
        ]
    },
    {
        id: 'q10',
        category: 'control',
        question: 'How much control do you feel you have over your communication workload?',
        options: [
            { value: 4, text: 'No control - Completely reactive' },
            { value: 3, text: 'Little control - Mostly reactive' },
            { value: 2, text: 'Some control - Mix of proactive and reactive' },
            { value: 1, text: 'Good control - Mostly proactive' }
        ]
    }
];

// Global variables
let currentResponses = {};
let currentQuestionIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    renderQuestions();
    setupFormHandling();
    updateProgress();
}

// Tab Navigation Setup
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab and button
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Render Assessment Questions
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    assessmentQuestions.forEach((q, index) => {
        const questionCard = createQuestionCard(q, index);
        container.appendChild(questionCard);
    });
}

function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.setAttribute('data-question', question.id);

    card.innerHTML = `
        <h3 class="question-title">
            ${index + 1}. ${question.question}
        </h3>
        <div class="options-grid">
            ${question.options.map((option, optionIndex) => `
                <label class="option-label" data-value="${option.value}">
                    <input type="radio" name="${question.id}" value="${option.value}" />
                    ${option.text}
                </label>
            `).join('')}
        </div>
    `;

    // Add event listeners for option selection
    const radioInputs = card.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            handleAnswerSelection(question.id, parseInt(this.value));
            updateOptionStyles(card, this.value);
        });
    });

    return card;
}

function updateOptionStyles(card, selectedValue) {
    const labels = card.querySelectorAll('.option-label');
    labels.forEach(label => {
        label.classList.remove('selected');
        if (label.getAttribute('data-value') === selectedValue) {
            label.classList.add('selected');
        }
    });
}

function handleAnswerSelection(questionId, value) {
    currentResponses[questionId] = value;
    updateProgress();
    checkFormCompletion();
}

function updateProgress() {
    const totalQuestions = assessmentQuestions.length;
    const answeredQuestions = Object.keys(currentResponses).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }

    if (progressText) {
        progressText.textContent = `Question ${answeredQuestions} of ${totalQuestions} completed`;
    }
}

function checkFormCompletion() {
    const totalQuestions = assessmentQuestions.length;
    const answeredQuestions = Object.keys(currentResponses).length;
    const submitBtn = document.getElementById('submitBtn');

    if (answeredQuestions === totalQuestions) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🎯 Get My Results';
    } else {
        submitBtn.disabled = true;
        submitBtn.textContent = `Complete ${totalQuestions - answeredQuestions} more questions`;
    }
}

// Form Handling
function setupFormHandling() {
    const form = document.getElementById('assessmentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processResults();
    });
}

function processResults() {
    const results = calculateScore();
    displayResults(results);
    switchTab('results');
}

function calculateScore() {
    let totalScore = 0;
    let categoryScores = {
        volume: 0,
        interruption: 0,
        pressure: 0,
        channels: 0,
        meetings: 0,
        focus: 0,
        stress: 0,
        afterhours: 0,
        productivity: 0,
        control: 0
    };

    // Calculate total and category scores
    assessmentQuestions.forEach(question => {
        const score = currentResponses[question.id] || 0;
        totalScore += score;
        categoryScores[question.category] += score;
    });

    // Determine severity level
    let severity = 'healthy';
    let severityText = 'Healthy Communication Balance';
    let severityClass = 'severity-healthy';

    if (totalScore >= 30) {
        severity = 'high';
        severityText = 'Significant Communication Overload';
        severityClass = 'severity-high';
    } else if (totalScore >= 20) {
        severity = 'moderate';
        severityText = 'Moderate Communication Overload';
        severityClass = 'severity-moderate';
    }

    return {
        totalScore,
        maxScore: 40,
        percentage: Math.round((totalScore / 40) * 100),
        severity,
        severityText,
        severityClass,
        categoryScores
    };
}

function displayResults(results) {
    displayScore(results);
    displayCategoryBreakdown(results.categoryScores);
    displayRecommendations(results);
}

function displayScore(results) {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = `
        <div class="score-display">
            <div class="score-circle">
                <div class="score-number">${results.totalScore}/${results.maxScore}</div>
            </div>
            <div class="score-label">Overall Communication Overload Score</div>
            <div class="severity-badge ${results.severityClass}">
                ${results.severityText}
            </div>
        </div>
    `;
}

function displayCategoryBreakdown(categoryScores) {
    const categoryLabels = {
        volume: '📧 Message Volume',
        interruption: '🔔 Interruptions',
        pressure: '⚡ Response Pressure',
        channels: '📱 Platform Overload',
        meetings: '🗓️ Meeting Load',
        focus: '🎯 Focus Impact',
        stress: '😰 Stress Level',
        afterhours: '🌙 After-hours Work',
        productivity: '📈 Productivity Impact',
        control: '🎛️ Control Level'
    };

    const breakdown = document.getElementById('categoryBreakdown');
    let htmlContent = '<div class="category-breakdown"><h3>📊 Category Breakdown</h3>';

    Object.entries(categoryScores).forEach(([category, score]) => {
        const maxCategoryScore = 4;
        const percentage = Math.round((score / maxCategoryScore) * 100);

        htmlContent += `
            <div class="category-item">
                <span class="category-name">${categoryLabels[category]}</span>
                <span class="category-score">${score}/${maxCategoryScore} (${percentage}%)</span>
            </div>
        `;
    });

    htmlContent += '</div>';
    breakdown.innerHTML = htmlContent;
}

function displayRecommendations(results) {
    const recommendationsContainer = document.getElementById('recommendations');
    let recommendations = [];

    // Generate recommendations based on score
    if (results.severity === 'high') {
        recommendations = [
            {
                title: '🚨 Immediate Action Required',
                text: 'Your communication overload is severe. Consider speaking with your manager about workload redistribution and implementing strict communication boundaries.'
            },
            {
                title: '📵 Digital Detox',
                text: 'Turn off all non-essential notifications immediately. Schedule specific times (2-3 times daily) to check messages instead of constant monitoring.'
            },
            {
                title: '⏰ Time Blocking',
                text: 'Block 2-4 hour periods daily for focused work with absolutely no communication interruptions. Use "Do Not Disturb" modes aggressively.'
            },
            {
                title: '🎯 Priority Framework',
                text: 'Implement a strict message triage system: Urgent (respond immediately), Important (respond within 4 hours), Everything else (respond within 24 hours).'
            }
        ];
    } else if (results.severity === 'moderate') {
        recommendations = [
            {
                title: '⚖️ Balance Improvement',
                text: 'Your communication load is manageable but needs optimization. Focus on creating more structured communication routines.'
            },
            {
                title: '📱 Platform Consolidation',
                text: 'Reduce the number of communication platforms you use. Try to consolidate similar functions into fewer apps.'
            },
            {
                title: '🔕 Smart Notifications',
                text: 'Customize notification settings to only receive alerts for truly urgent matters. Use keyword filters and VIP lists.'
            },
            {
                title: '🗓️ Communication Schedule',
                text: 'Establish set times for checking messages (e.g., 9 AM, 1 PM, 5 PM) rather than continuous monitoring.'
            }
        ];
    } else {
        recommendations = [
            {
                title: '✅ Excellent Balance',
                text: 'You have a healthy relationship with workplace communication. Continue monitoring your habits to maintain this balance.'
            },
            {
                title: '📈 Optimization Opportunities',
                text: 'Look for small efficiencies like using templates for common responses or batch processing similar messages.'
            },
            {
                title: '👥 Help Others',
                text: 'Share your successful communication strategies with colleagues who may be struggling with overload.'
            },
            {
                title: '🔄 Regular Review',
                text: 'Retake this assessment monthly to ensure your communication habits remain healthy as work demands change.'
            }
        ];
    }

    let htmlContent = '<div class="recommendations"><h3>💡 Personalized Recommendations</h3>';
    recommendations.forEach(rec => {
        htmlContent += `
            <div class="recommendation-item">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-text">${rec.text}</div>
            </div>
        `;
    });
    htmlContent += '</div>';

    recommendationsContainer.innerHTML = htmlContent;
}

// Utility Functions
function retakeAssessment() {
    currentResponses = {};
    switchTab('assessment');

    // Reset form
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });

    document.querySelectorAll('.option-label').forEach(label => {
        label.classList.remove('selected');
    });

    updateProgress();
    checkFormCompletion();
}

function exportResults() {
    const results = calculateScore();
    const timestamp = new Date().toLocaleDateString();

    const exportData = {
        date: timestamp,
        totalScore: results.totalScore,
        maxScore: results.maxScore,
        percentage: results.percentage,
        severity: results.severityText,
        categoryBreakdown: results.categoryScores,
        responses: currentResponses
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `communication-overload-assessment-${timestamp.replace(/\//g, '-')}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also create a human-readable version
    exportReadableResults(results, timestamp);
}

function exportReadableResults(results, timestamp) {
    const categoryLabels = {
        volume: 'Message Volume',
        interruption: 'Interruptions',
        pressure: 'Response Pressure',
        channels: 'Platform Overload',
        meetings: 'Meeting Load',
        focus: 'Focus Impact',
        stress: 'Stress Level',
        afterhours: 'After-hours Work',
        productivity: 'Productivity Impact',
        control: 'Control Level'
    };

    let reportText = `Communication Overload Assessment Results\n`;
    reportText += `Date: ${timestamp}\n\n`;
    reportText += `Overall Score: ${results.totalScore}/${results.maxScore} (${results.percentage}%)\n`;
    reportText += `Assessment: ${results.severityText}\n\n`;
    reportText += `Category Breakdown:\n`;

    Object.entries(results.categoryScores).forEach(([category, score]) => {
        reportText += `- ${categoryLabels[category]}: ${score}/4\n`;
    });

    reportText += `\nNext Steps:\n`;
    reportText += `- Review personalized recommendations in the assessment tool\n`;
    reportText += `- Retake assessment in 30 days to track progress\n`;
    reportText += `- Share results with manager if communication overload impacts work\n`;

    const textBlob = new Blob([reportText], {type: 'text/plain'});
    const textLink = document.createElement('a');
    textLink.href = URL.createObjectURL(textBlob);
    textLink.download = `communication-assessment-report-${timestamp.replace(/\//g, '-')}.txt`;

    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Allow normal tab behavior
        return;
    }

    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('option-label')) {
            const radio = activeElement.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        }
    }
});

// Add accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels and descriptions
    document.querySelectorAll('.question-card').forEach((card, index) => {
        card.setAttribute('role', 'group');
        card.setAttribute('aria-labelledby', `question-${index + 1}`);
    });

    // Add focus management
    document.querySelectorAll('.option-label').forEach(label => {
        label.setAttribute('tabindex', '0');
        label.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
        });
        label.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);