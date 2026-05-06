const en = {
    translation: {
        layout: {
            "shortcut": "Temporary shortcut menu",
            "pdfGen": "Please download your assessment to your device by pressing the button below.",
            "home": "Welcome!",
            "pastAssessments": "Past Assessments",
            "signup": "Please create an account using the participant ID provided by the research team:",
            "screening": "Check your risk of falling by answering the following questions:",
            "bloodTest": "Measure your orthostatic blood pressure.",
            "visionUpload": "Complete the vision assessment while recording.",
            "walkingUpload": "Complete the walking assessment while recording.",
            "success": "Success!",
            "homeHazards": "Please select which of the following elements you have in your home:",
            "footTestInstruct": "How to use a monofilament to test for foot neuropathy:",
            "footTest": "Perform the monofilament foot test.",
            "vitaminDTestInstruct": "Vitamin D Assessment",
            "vitaminDTest": "Record vitamin D assessment results.",
            "medicationUpload": "Next, we want to assess your medications to determine how they might influence fall risk.",
            "medicationResults": "Please view the summary of your medication below.",
            "medicationTypedUpload": "Next, we want to assess your medications to determine how they might influence fall risk.",
            "moodQuestions": "Answer the following questions:",
            "assessComplete": "Great job, you finished the assessment!",
            "educationalResources": "Educational Resource Links",
            "educationalBrochures": "Brochures",
            "educationalFactSheets": "Fact Sheets",
            "additionalInformation": "Additional Information",
            "visionInstruction": "Vision Test Instructions",
            "visionTestLeft": "Vision Test using Left Eye",
            "visionTestRight": "Vision Test using Right Eye"

        },
        index: {
            "title": "STEADI",
            "getStarted": "Get Started",
            "shortcut": "Page Shortcut"
        },
        shortcut: {
            "screening": "Begin Screening",
            "modifiableRisk": "Begin Modifiable Risk Assessment",
            "pdfGen": "Test PDFGen",
            "footTest": "Go to FootTest"
        },
        login: {
            "title": "Sign in to your Account",
            "subtitle": "Enter your email and password to log in",
            "appleButton": "Continue with Apple",
            "or": "Or",
            "emailPlaceholder": "example@email.com",
            "passwordPlaceholder": "********",
            "rememberMe": "Remember me",
            "forgotPassword": "Forgot Password?",
            "login": "Log in",
            "noAccount": "Don't have an account?",
            "signUp": " Sign up",
            "alert": "Login failed!"
        },
        signup: {
            "title": "Please create an account using the participant ID provided by the STEADI research team",
            "subtitle": "Enter your phone number, email, and password to sign up",
            "email": "Email",
            "participantID": "Participant ID",
            "password": "Password",
            "confirmPassword": "Confirm Password",
            "emailPlaceholder": "example@email.com",
            "phonePlaceholder": "123-456-7890",
            "passwordPlaceholder": "********",
            "confirmPasswordPlaceholder": "********",
            "next": "Next",
            "signUp": "Sign Up",
            "successAlert": "Account created successfully!",
            "errorAlert": "Sign-up failed!",
        },
        home: {
            "pastAssessments": "View Past Assessments",
            "resume": "Resume Assessments",
            "newAssessment": "Start New Assessment",
            "educationalResources": "Educational Resources",
            "errorTitle": "Error",
            "errorMessage": "Could not retrieve your assessment progress."
        },
        screening: {
            "answerOptions": {
                "yes": "Yes",
                "no": "No"
            },
            "whyItMatters": "Why it matters",
            "nextButton": "Next",
            "modalButton": "Got it!",
            "finishButton": "Finish"
        },
        screeningFollowUps: {
            "fallCount": "How many times have you fallen in the past year?",
            "injuryAssessment": "Were you injured?",
            "injuryOptions": {
                "yes": "Yes",
                "no": "No"
            },
            "submitButton": "Submit"
        },
        screeningQuestions: {
            "q1": {
                "prompt": "I have fallen in the past year.",
                "whyItMatters": "People who have fallen once are likely to fall again."
            },
            "q2": {
                "prompt": "I use or have been advised to use a cane or walker to get around safely.",
                "whyItMatters": "People who have been advised to use a cane or walker may already be more likely to fall."
            },
            "q3": {
                "prompt": "Sometimes I feel unsteady when walking.",
                "whyItMatters": "Unsteadiness or needing support while walking are signs of poor balance."
            },
            "q4": {
                "prompt": "I worry about falling.",
                "whyItMatters": "People who are worried about falling are more likely to fall."
            },
            "q5": {
                "prompt": "I need to push with my hands to stand up from a chair.",
                "whyItMatters": "This is a sign of weak leg muscles, a major reason for falling."
            },
            "q6": {
                "prompt": "I have trouble stepping up onto a curb.",
                "whyItMatters": "This is a sign of weak leg muscles, a major reason for falling."
            },
            "q7": {
                "prompt": "I have lost some feeling in my feet.",
                "whyItMatters": "Numbness in your feet can cause stumbles and lead to falls."
            },
            "q8": {
                "prompt": "I often feel light-headed when getting up.",
                "whyItMatters": "Light-headedness can cause sudden drops in blood pressure that lead to falls."
            },
            "q9": {
                "prompt": "I take medicine that makes me feel tired or dizzy.",
                "whyItMatters": "Side effects from medicines can sometimes increase your chance of falling."
            },
            "q10": {
                "prompt": "I take medicine to help me sleep or improve my mood.",
                "whyItMatters": "These medicines can sometimes increase your chance of falling."
            },
            "q11": {
                "prompt": "I often feel sad or depressed.",
                "whyItMatters": "Symptoms of depression, such as not feeling well or feeling slowed down, are linked to falls."
            },
            "q12": {
                "prompt": "I have to rush to the toilet.",
                "whyItMatters": "Rushing to the bathroom, especially at night, increases your chance of falling."
            },
        },
        screeningResults: {
            "highRisk": {
                "bodyHeader": "Your screening results are associated with a higher risk of falling.",
                "bodyText": "Next, you will be completing an assessment to measure your modifiable fall risk factors. Once completed, you will receive a printable summary of your Fall Risk Factors. The assessment will take approximately 60 minutes and requires use of your at-home kit."
            },
            "lowRisk": {
                "bodyHeader": "Your screening results are associated with a lower risk of falling.",
                "bodyText": "You are not currently at a high risk for falling. It is still important to stay aware and informed in order to prevent falls. You have the option to complete the assessment of modifiable risk factors, or you may select to return to your home profile and view prevention resources from the CDC."
            },
            "startAssessmentButton": "Start Assessment"
        },
        logout: {
            "button": "Log Out"
        }
    },
};

export default en;
export type EnTranslation = typeof en.translation;