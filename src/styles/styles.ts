import { StyleSheet, Platform } from 'react-native';

const containerShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
};

const buttonShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
};



export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F6F8FA', // gray background color
    },
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: { // white rounded container in the center of login
        width: '100%',
        maxWidth: 384, // max-w-sm
        height: 500,
        marginTop: 200,
        backgroundColor: '#FFFFFF',
        borderRadius: 24, // rounded-3xl
        overflow: 'hidden',
        flexDirection: 'column',
        ...Platform.select({
            ios: containerShadow,
            android: {
                elevation: 20,
            },
            web: containerShadow,
        }),
    },
    header: {
        backgroundColor: '#B14B02', // orange background color
        paddingTop: 304,
        paddingBottom: 32,
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.9,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        padding: 24,
        justifyContent: 'space-between',
        position: 'relative',
    },
    appleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    appleButtonText: {
        color: '#374151',
        fontWeight: '500',
        marginLeft: 12,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#D1D5DB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#6B7280',
    },
    form: {
        // Spacing is now handled by marginBottom on individual elements
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        fontSize: 16,
    },
    passwordContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        borderColor: '#4338CA', // indigo-900
        backgroundColor: '#4338CA',
    },
    rememberMeText: {
        color: '#111827',
    },
    forgotPasswordText: {
        fontWeight: '500',
        color: '#3B82F6', // blue-600
    },
    loginButton: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#3730A3', // indigo-900
        borderRadius: 8,
        alignItems: 'center',
        ...Platform.select({
            ios: buttonShadow,
            android: {
                elevation: 3,
            },
            web: buttonShadow,
        }),
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    signupContainer: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupText: {
        color: '#4B5563',
    },
    signupLink: {
        fontWeight: '500',
        color: '#3B82F6', // blue-600
    },
    globeContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },

    //Header Styles
    layoutHeader:
    {
        height: 190,
        backgroundColor:'#B14B02',
    },

    backBtn:
    {
        fontSize: 25,
        color: 'white',
        left: 13,
        top: 56,
        fontWeight: "bold",
        position: "absolute"
    },

    headerText:
    {
        color: "white",
        fontWeight: "bold",
        top: 116,
        marginLeft: 18,
        fontSize: 16,
        marginRight: 18,
        lineHeight: 25,
        position: "absolute"
    },

    //Index Styles
    inxContainer:
    {
        alignItems: 'center',
        backgroundColor: "#B14B02",
        flex: 1,
    },
    
    sampleUserBtn:
    {
        top: "25%",
    },  
    
    inxBtn:
    {
        justifyContent: 'center',
        top: "73.55%",
        paddingVertical: 12,
        backgroundColor: '#3730A3',
        borderRadius: 8,
       ...Platform.select({
          ios: {
            buttonShadow,
          },
          android: {
            elevation: 3,
          },
          web: {buttonShadow,
          },
        }),
        position: 'absolute',
        width: 214,
    },
    
    tempText:
    {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 48,
        textAlign: 'center',
    },
    
    inxBtnText:
    {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    shield: 
    {
        height: 217,
        justifyContent: 'center',
        top: '34.54%',
        width: 218
    }
});
