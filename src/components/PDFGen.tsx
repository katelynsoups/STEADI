// @refresh reset

import React, {useEffect, useRef, useState} from 'react';
import { styles } from '../styles/styles';
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import {diagramFileName} from './FootTest';
import {getUserStudyData} from '../utils/getData';
import {getHazards} from '../data/hazardQuestions';

const router = useRouter()

const PDFGen = () =>
{
    const [riskScore, setRiskScore] = useState<number>(0);
    const [standingBP, setStandingBP] = useState<string>("");
    const [lyingBP, setLyingBP] = useState<string>("");
    const [medications, setMedications] = useState<string>("");
    const [hazards, setHazards] = useState<string>("");
    const [diagram, setDiagram] = useState<string>("");
    const [depress, setDepress] = useState<string>("");
    const [pleasure, setPleasure] = useState<string>("");
    const [vitaminD, setVitamin] = useState<string>("");
    const [isLoaded, setLoaded] = useState(false);
    const [ready, isReady] = useState(false);
    const screenResults = useRef(new Map<string, string>()).current;

    const { id } = useLocalSearchParams();

    const setScreenings = async (results : Object) =>
    {
        let risk : number = 0;
        for (const [key, value] of Object.entries(results))
        {
            screenResults.set(key, value);
            if(value == 'Yes')
                risk++;
        }

        setRiskScore(risk);
    }

    const checkMedications = async (meds : Object) =>
    {
        let trueMeds : string = "" 

        for (const [key, value] of Object.entries(meds))
            if (value == true)
                trueMeds = trueMeds.concat(key, "<br>")

        setMedications(trueMeds);
    }

    const checkHazards = async (hazards : Object) =>
    {
        let trueHazards : string = "" 
        let bedLight : string = getHazards(1)[1].text;
        let nightLight : string = getHazards(1)[2].text;
        let stool : string = getHazards(1)[0].text;

        for (const [key, value] of Object.entries(hazards))
        {
            if (key === bedLight || key === nightLight || key === stool)
            {
                if(value == false)
                    trueHazards = trueHazards.concat("Does not have ", key.toLowerCase(), "<br>");
            }
            else if (value == true)
                trueHazards = trueHazards.concat(key, "<br>");
        }

        setHazards(trueHazards);
    }

    const convertURI = async () =>
    {  
        const uri : string = FileSystem.documentDirectory + 'images';
        const dirCheck = await FileSystem.getInfoAsync(uri)
        
        if(!dirCheck.exists)
        {
            await FileSystem.makeDirectoryAsync(uri, { intermediates: true })
            console.log("Created directory!");
        }

        let base64 : string = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'images' + diagramFileName,
        {
            encoding: FileSystem.EncodingType.Base64
        })

        setDiagram(base64);
    }

    convertURI();

    useEffect(() => 
    {
        if(typeof id === "string")
        {
            getUserStudyData(id).then(userData =>
            {
                if(userData)
                { 
                    if (userData[6])
                        setScreenings(userData[6])

                    if(userData[0])
                    {
                        setStandingBP(userData[0].standingBP);
                        setLyingBP(userData[0].lyingBP);
                    }
                    
                    if(userData[1])
                        checkMedications(userData[1]);

                    if(userData[2])
                        checkHazards(userData[2]);

                    if(userData[4] && userData[5])
                    {
                        setDepress(userData[4]);
                        setPleasure(userData[5]);
                    }

                    if(userData[7])
                        setVitamin(userData[7])

                }

            }).then(result =>
            {
                setLoaded(true);
            });
        }
    }, []);

    useEffect(() =>
    {
        if(isLoaded)
        {
            savePDF();
        }

        isReady(true);
    }, [isLoaded]);

    const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
        body
        {
            margin-left: 2%;
            margin-right: 2%;
        }

        header
        {
            display: flex;
            flex-direction: row;
        }

        table 
        {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td, th 
        {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) 
        {
            background-color: #dddddd;
        }

        #med
        {
            border: 1px solid black;    
        }

        #feetResults
        {
            width: 400;
            height: 400;
        }

    </style>
  </head>

  <body>
    <header>
        <h1 style = "font-family: Calibri; font-size: 70px; justify-content: flex-start; margin-top: 1%">STEADI</h1>

        <div style = "margin-left:auto; margin-top: 1%">
            <h2>Date: ${new Date().toLocaleDateString()}</h2>
        </div>
    </header>

    <h1>Screening Questions</h1>
     <table>
        <tr>
            <th>Question</th>
            <th>Answer</th>
        </tr>
        <tr>
            <th>I have fallen in the past year.</th>
            <th>${screenResults.get("fallen")}</th>
        </tr>
        <tr>
            <th>I use or have been advised to use a cane or walker to get around safely.</th>
            <th>${screenResults.get("cane")}</th>
        </tr>
        <tr>
            <th>Sometimes I feel unsteady when walking.</th>
            <th>${screenResults.get("unsteady")}</th>
        </tr>
        <tr>
            <th>I worry about falling.</th>
            <th>${screenResults.get("worried")}</th>
        </tr>
        <tr>
            <th>I need to push with my hands to stand up from a chair.</th>
            <th>${screenResults.get("handsToStand")}</th>
        </tr>
        <tr>
            <th>I have trouble stepping up onto a curb.</th>
            <th>${screenResults.get("curb")}</th>
        </tr>
        <tr>
            <th>I have lost some feeling in my feet.</th>
            <th>${screenResults.get("numbFeet")}</th>
        </tr>
        <tr>
            <th>I often feel light-headed when getting up.</th>
            <th>${screenResults.get("lightheaded")}</th>
        </tr>
        <tr>
            <th>I take medicine that makes me feel tired or dizzy.</th>
            <th>${screenResults.get("medDizzy")}</th>
        </tr>
        <tr>
            <th>I take medicine to help me sleep or improve my mood.</th>
            <th>${screenResults.get("sleepMeds")}</th>
        </tr>
        <tr>
            <th>I often feel sad or depressed.</th>
            <th>${screenResults.get("sad")}</th>
        </tr>
        <tr>
            <th>I have to rush to the toilet.</th>
            <th>${screenResults.get("rushBathroom")}</th>
        </tr>
    </table>
    <h1>Fall Risk Score: ${riskScore}</h1>

    <h1>Blood Pressure</h1>
    <table>
        <tr>
            <th>Standing Blood Pressure</th>
            <th>${standingBP}</th>
        </tr>
        <tr>
            <th>Lying Blood Pressure</th>
            <th>${lyingBP}</thth>
        </tr>
    </table>

    <h1>Medications Identified for Fall Risk</h1>
    <p id = "med">${medications}</p>

    <h1>Home Hazards</h1>
    <p id = "med">${hazards}</p>

    <h1>Neuropathy Results<h1>
    <img id = "feetResults" src ="data:image/png;base64,${diagram}"></img>

    <h1>Mood Questions</h1>
            <p>1: Not at all</p>
            <p>2: Several days</p>
            <p>3: More than half days</p>
            <p>4: Nearly everyday</p>
    <table>
        <tr>
            <th>Little interest or pleasure in doing things.</th>
            <th>${depress}</th>
        </tr>
        <tr>
            <th>Feeling down, depressed, or hopeless.</th>
            <th>${pleasure}</th>
        </tr>
    </table>

    <h1>Vitamin D Levels: ${vitaminD}</h1>

  </body>
</html>
    `;

    const printToFile = async () => 
    {
        const { uri } = await Print.printToFileAsync({html});
        console.log('File has been saved to:', uri);
        return uri;
    }

    const savePDF = async () => 
    {
        const uri = await printToFile();
        if (uri) 
        {
            const pdfURI = `${FileSystem.documentDirectory}pdf/${new Date().toDateString()}.pdf`
            const dirCheck = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "pdf")

            if(!dirCheck.exists)
            {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "pdf", { intermediates: true })
                console.log("Created directory!");
            }

            try
            {
                await FileSystem.moveAsync({
                    from: uri,
                    to: pdfURI
                })
            }
            catch (error)
            {
                console.log("Could not save PDF: ", error);
                Alert.alert(
                    "Could not generate PDF!",
                    "There was an issue generating your results.",
                    [
                        {
                            text: "Ok",
                            style: "cancel"
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    }

    const downloadPDF = async () =>
    {
        const pdfURI = `${FileSystem.documentDirectory}pdf/${new Date().toDateString()}.pdf`

        if(await Sharing.isAvailableAsync())
        {
            await Sharing.shareAsync(pdfURI);
        }
    }

    return (
        <View style = {styles.background}> 

            {ready && <TouchableOpacity onPress = {() => downloadPDF()} style = {[styles.blueNextButton, {bottom: 150}]}>
                    <Text style = {[styles.btnText]}>Download Results PDF</Text>
            </TouchableOpacity>}
        </View>
        
    )
}

export default PDFGen;