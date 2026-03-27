import React, {useEffect, useState} from 'react';
import { styles } from '../styles/styles';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import {diagramFileName} from './FootTest';
import {getScreeningEvents} from '../utils/eventLogger';
import {getUserStudyData} from '../utils/getData';
import {getHazards} from '../data/hazardQuestions';

const router = useRouter()

const PDFGen = () =>
{
    const [standingBP, setStandingBP] = useState<string>("");
    const [lyingBP, setLyingBP] = useState<string>("");
    const [medications, setMedications] = useState<string>("");
    const [hazards, setHazards] = useState<string>("");
    const [diagram, setDiagram] = useState<string>("");
    const [depress, setDepress] = useState<string>("");
    const [pleasure, setPleasure] = useState<string>("");

    const checkMedications = (meds : Object) =>
    {
        let trueMeds : string = "" 

        for (const [key, value] of Object.entries(meds))
            if (value == true)
                trueMeds = trueMeds.concat(key, "<br>")

        setMedications(trueMeds);
    }

    const checkHazards = (hazards : Object) =>
    {
        let trueHazards : string = "" 
        let bedLight : string = getHazards(1)[1].text;
        let nightLight : string = getHazards(1)[2].text;
        let stool : string = getHazards(1)[0].text;

        console.log(hazards);

        for (const [key, value] of Object.entries(hazards))
        {
            if (key === bedLight || key === nightLight || key === stool)
            {
                if(value == false)
                    trueHazards = trueHazards.concat("Does not have ", key, "<br>");
            }
            else if (value == true)
                trueHazards = trueHazards.concat(key, "<br>");
        }

        setHazards(trueHazards);
    }

    const convertURI = async () =>
    {  
        try
        {
            const base64 : string = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'images' + diagramFileName,
            {
                encoding: FileSystem.EncodingType.Base64
            })

            setDiagram(base64);
        }
        catch(error)
        {
            console.log("Error converting saved Foot Diagram to base64: ", error)
        }
    }

    useEffect(() => 
    {
        getUserStudyData().then(userData =>
        {
            if(userData)
            { 
                if(userData[0])
                {
                    setStandingBP(userData[0].standingBP);
                    setLyingBP(userData[0].lyingBP);
                }
                
                if(userData[1])
                    checkMedications(userData[1]);

                if(userData[2])
                    checkHazards(userData[2]);

                if(userData[3])
                    convertURI();

                if(userData[4] && userData[5])
                {
                    setDepress(userData[4]);
                    setPleasure(userData[5]);
                }
            }
        });
    }, []);

    const screeningEvents = getScreeningEvents();

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
            <th>TEMP</th>
        </tr>
        <tr>
            <th>How many times have you fallen in the last year?</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>Were you injured?</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I use or have been advised to use a cane or walker to get around safely.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>Sometimes I feel unsteady when walking.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I worry about falling.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I need to push with my hands to stand up from a chair.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I have trouble stepping up onto a curb.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I have lost some feeling in my feet.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I often feel light-headed when getting up.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I take medicine that makes me feel tired or dizzy.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I take medicine to help me sleep or improve my mood.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I often feel sad or depressed.</th>
            <th>TEMP</th>
        </tr>
        <tr>
            <th>I have to rush to the toilet.</th>
            <th>TEMP</th>
        </tr>
    </table>
    <h2>Fall Risk Score: </h2h2>

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
            if(await Sharing.isAvailableAsync())
            {
                await Sharing.shareAsync(uri);
            }
        }

    }

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>Solely for testing out PDF Generation. This page should not exist in our final version.</Text>

            <TouchableOpacity onPress = {() => savePDF()} style = {styles.blueNextButton}>
                    <Text style = {[styles.btnText]}>PRINT HTML</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default PDFGen;