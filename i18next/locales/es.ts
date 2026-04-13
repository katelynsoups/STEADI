
const es = {

    translation: {
        layout: {
            "shortcut": "Menú de atajos temporero",
            "pdfGen": "¡Felicitaciones! ¡Usted ha completado su evaluación!",
            "home": "¡Bienvenido!",
            "pastAssessments": "Previas evaluaciones",
            "signup": "Favor de crear su cuenta usando el número de participante que le proveyó el equipo de investigación de STEADI:",
            "screening": "Evalúe su riesgo de caída respondiendo a las siguientes preguntas:",
            "bloodTest": "Tome su presión arterial ortostática.",
            "visionUpload": "Complete su evaluación visual mientras graba.",
            "walkingUpload": "Complete la evaluación de caminata mientras graba.",
            "success": "¡Éxito!",
            "homeHazards": "Favor de seleccionar cuál de los siguientes elementos tiene en su hogar:",
            "footTestInstruct": "Cómo usar un monofilamento para probar la neuropatía del pie:",
            "footTest": "Cómo hacer la prueba del monofilamento para probar la neuropatía del pie:",
            "vitaminDTestInstruct": "Evaluación de vitamina D",
            "vitaminDTest": "Registre los resultados de la evaluación de su vitamina D.",
            "medicationUpload": "A continuación, queremos evaluar sus medicamentos para determinar cómo podrían influir en el riesgo de caída.",
            "medicationResults": "Por favor, revise el resumen de su medicamento a continuación",
            "medicationTypedUpload": "A continuación, queremos evaluar sus medicamentos para determinar cómo podrían influir en el riesgo de caída.",
            "moodQuestions": "Favor de responder las siguientes preguntas:",
            "assessComplete": "¡Buen trabajo, has terminado la evaluación!", 
            "educationalResources": "Enlaces a recursos educativos",
            "educationalBrochures": "Folletos",
            "educationalFactSheets": "Hojas informativas",
            "additionalInformation": "Información adicional",
            "visionInstruction": "Instrucciones de la Prueba Visual",
            "visionTestLeft": "Prueba Visual (Ojo Izquierdo)",
            "visionTestRight": "Prueba Visual (Ojo Derecho)"
        },
        index: {
            "title": "STEADI",
            "getStarted": "Comience",
            "shortcut": "Acceso directo a la página"
        },
        shortcut: {
            "screening": "Comience la evaluación",
            "modifiableRisk": "Comenzar evaluación de riesgo modificable",
            "pdfGen": "Probar el PDFGen",
            "footTest": "Ir a la prueba del pie"
        },
        login: {
            "title": "Inicie sesión en su cuenta",
            "subtitle": "Ingrese su número de teléfono y contraseña para iniciar sesión",
            "appleButton": "Continuar con Apple",
            "or": "Opción adicional",
            "emailPlaceholder": "ejemplo@email.com",
            "passwordPlaceholder": "********",
            "rememberMe": "Recordar sesión",
            "forgotPassword": "¿Olvidó su contraseña?",
            "login": "Iniciar sesión",
            "noAccount": "¿No tiene una cuenta?",
            "signUp": " Inscribirse",
            "alert": "¡Error de acceso!"
        },
        signup: {
            "title": "Favor de crear una cuenta usando el número de participante que le proveyó el equipo de investigación de STEADI",
            "subtitle": "Ingrese su número de teléfono, correo electrónico y contraseña para registrarse",
            "email": "Correo electrónico",
            "participantID": "Número de participante",
            "password": "Contraseña",
            "confirmPassword": "Confirme su contraseña",
            "emailPlaceholder": "ejemplo@email.com",
            "phonePlaceholder": "123-456-7890",
            "passwordPlaceholder": "********",
            "confirmPasswordPlaceholder": "********",
            "next": "Siguiente",
            "signUp": "Inscribirse",
            "successAlert": "¡Cuenta creada exitosamente!",
            "errorAlert": "¡Error de acceso!",
        },
        home: {
            "pastAssessments": "Evaluaciones previas",
            "resume": "Continuar la evaluación",
            "newAssessment": "Iniciar nueva evaluación",
            "educationalResources": "Recursos educativos",
            "errorTitle": "Error",
            "errorMessage": "No se pudo recuperar el progreso de su evaluación."
        },
        screening: {
            "answerOptions": {
                "yes": "Sí",
                "no": "No"
            },
            "whyItMatters": "¿Por qué es importante?",
            "modalButton": "Entiendo",
            "nextButton": "Siguiente",
            "finishButton": "Finalizar"
        },
        screeningFollowUps: {
            "fallCount": "¿Cuántas veces se ha caído en este año?",
            "injuryAssessment": "¿Resultó en alguna lesión?",
            "injuryOptions": {
                "yes": "Sí",
                "no": "No"
            },
            "submitButton": "Enviar"
        },
        screeningQuestions: {
            "q1": {
                "prompt": "He tenido una caída en este año.",
                "whyItMatters": "Las personas que han caído una vez tienen más probabilidades de volver a caer."
            },
            "q2": {
                "prompt": "Uso o me han aconsejado usar un bastón o andador para moverme de manera segura.",
                "whyItMatters": "Las personas a las que se les ha aconsejado usar un bastón o andador pueden ser más propensas a caer."
            },
            "q3": {
                "prompt": "A veces me siento inestable al caminar.",
                "whyItMatters": "La inestabilidad o la necesidad de apoyo al caminar son signos de mal equilibrio."
            },
            "q4": {
                "prompt": "Me preocupa caerme.",
                "whyItMatters": "Las personas que están preocupadas por caerse tienen más probabilidades de caerse."
            },
            "q5": {
                "prompt": "Necesito empujarme con mis manos para levantarme de una silla.",
                "whyItMatters": "Esto es un signo de debilidad en las piernas, la razón principal de caídas."
            },
            "q6": {
                "prompt": "Tengo problemas para subir una acera.",
                "whyItMatters": "Esto es un signo de debilidad en las piernas, la razón principal de caídas."
            },
            "q7": {
                "prompt": "Tengo entumecimiento en los pies.",
                "whyItMatters": "El entumecimiento en los pies puede causar tropiezos y provocar caídas."
            },
            "q8": {
                "prompt": "A menudo me siento mareado(a) al levantarme.",
                "whyItMatters": "La sensación de mareo al levantarse puede ser un signo de presión arterial baja al cambiar de posición, lo que puede aumentar el riesgo de caída."
            },
            "q9": {
                "prompt": "Tomo medicamentos que me hacen sentir cansado(a) o mareado(a).",
                "whyItMatters": "Los efectos secundarios de los medicamentos pueden aumentar el riesgo de caída."
            },
            "q10": {
                "prompt": "Tomo medicamentos para ayudarme a dormir o mejorar mi estado de ánimo.",
                "whyItMatters": "Estos medicamentos pueden aumentar el riesgo de caída."
            },
            "q11": {
                "prompt": "A menudo me siento triste o deprimido(a).",
                "whyItMatters": "Los síntomas de depresión, como no sentirse bien o sentirse lento, están relacionados con las caídas."
            },
            "q12": {
                "prompt": "Tengo que apresurarme para ir al baño.",
                "whyItMatters": "Apresurarse para ir al baño, especialmente por la noche, aumenta el riesgo de caídas."
            },
        },
        screeningResults: {
            "highRisk": {
                "bodyHeader": "Los resultados de su evaluación sugieren que usted está más propenso a sufrir caídas.",
                "bodyText": "A continuación, completará una evaluación para medir sus factores de riesgo de caídas modificables. Una vez finalizado, recibirá un resumen para imprimir, para conocer mejor sus factores de riesgo de caídas. La evaluación tomará aproximadamente 60 minutos y requiere el uso del equipo doméstico que se le proveyó."   
            },
            "lowRisk": {
                "bodyHeader": "Los resultados de su evaluación sugieren que usted está menos propenso a sufrir caídas.",
                "bodyText": "Actualmente usted no está en alto riesgo de caída. Sin embargo, es importante mantenerse consciente e informado para prevenir caídas. Tiene la opción de completar la evaluación de factores de riesgo modificables, o puede seleccionar regresar a su perfil principal y ver los recursos de prevención del CDC."
            },
            "startAssessmentButton": "Comenzar evaluación",
        },
        logout: {
            "button": "Cerrar sesión"
        }
    }
};

export default es;
export type EsTranslation = typeof es.translation;