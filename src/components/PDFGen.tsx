// @refresh reset

import React, {useEffect, useRef, useState} from 'react';
import { styles } from '../styles/styles';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import {diagramFileName} from './LeftFootTest';
import { getPID } from '../utils/dataEntry';
import {getUserStudyData} from '../utils/getData';
import {getHazards} from '../data/hazardQuestions';
import { useTranslation } from 'react-i18next';

const PDFGen = () =>
{
    const router = useRouter();
    const { t } = useTranslation();
    const [riskScore, setRiskScore] = useState<number>(0);
    const [standingBP, setStandingBP] = useState<string>("");
    const [lyingBP, setLyingBP] = useState<string>("");
    const [medications, setMedications] = useState<string>("");
    const [hazards, setHazards] = useState<string>("");
    const [leftDiagram, setLeftDiagram] = useState<string>("");
    const [rightDiagram, setRightDiagram] = useState<string>("");
    const [depress, setDepress] = useState<string>("");
    const [pleasure, setPleasure] = useState<string>("");
    const [vitaminD, setVitamin] = useState<string>("");
    const [leftMatch, setLeft] = useState<number>(-1);
    const [rightMatch, setRight] = useState<number>(-1);
    const [test, setTest] = useState<string[]>([]);
    const [isLoaded, setLoaded] = useState(false);
    const [ready, isReady] = useState(false);
    const screenResults = useRef(new Map<string, string>()).current;

    const { id, date } = useLocalSearchParams();

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
        let trueMeds : string = `<h1 id = "med">Medications Identified for Fall Risk</h1><table>`
        let counter = 0;
        let hasEntry : boolean = false;

        for (const [key, value] of Object.entries(meds))
        {
            if (value == true)
            {
                trueMeds = trueMeds.concat("<tr><th>", key, "</th></tr>")
                counter++;
                hasEntry = true;
            }
            if ((counter % 26) == 0 && counter > 0)
                trueMeds = trueMeds.concat(`</table><h1 id = "med">Medications Identified for Fall Risk (Continued)</h1><table>`)
        }

        if(hasEntry)
        {
            trueMeds = trueMeds.concat("</table>");
            setMedications(trueMeds);
        }
        else
            setMedications("");
    }

    const checkHazards = async (hazards : Object) =>
    {
        let trueHazards : string = "<h1>Home Hazards</h1><table>" 
        const bedLight : string = getHazards(1)[1].text;
        const nightLight : string = getHazards(1)[2].text;
        const stool : string = getHazards(1)[0].text;
        let hasEntry : boolean = false;

        for (const [key, value] of Object.entries(hazards))
        {
            if (key === bedLight || key === nightLight || key === stool)
            {
                if(value == false)
                {
                    trueHazards = trueHazards.concat("<tr><th>Does not have ", key.toLowerCase(), "</th></tr>");
                    hasEntry = true;
                }
            }
            else if (value == true)
            {
                trueHazards = trueHazards.concat("<tr><th>", key, "</th></tr>");
                hasEntry = true;
            }
        }

        if (hasEntry)
        {
            trueHazards = trueHazards.concat("</table>");
            setHazards(trueHazards);
        }
        else
            setHazards("");
            

        
    }

    const convertURI = async () => {
        const pid = await getPID();
        const baseURI = FileSystem.documentDirectory + pid + 'images';

        const dirCheck = await FileSystem.getInfoAsync(baseURI);
        if (!dirCheck.exists)
            await FileSystem.makeDirectoryAsync(baseURI, { intermediates: true });

        const leftBase64 = await FileSystem.readAsStringAsync(baseURI + id + "LeftNeuropathyDiagram.png",
            { encoding: FileSystem.EncodingType.Base64 });
        setLeftDiagram(leftBase64);

        const rightBase64 = await FileSystem.readAsStringAsync(baseURI + id + "RightNeuropathyDiagram.png",
            { encoding: FileSystem.EncodingType.Base64 });
        setRightDiagram(rightBase64);
    }

    const setTests = async (tests: Object) => {
        let temp: string[] = []

        for (const [key, value] of Object.entries(tests))
        {
            temp.push(value.tug_duration)
        }

        setTest(temp);
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

                    if(userData[8])
                        setTests(userData[8])
                    if(userData[9] && userData[10])
                    {
                        setLeft(userData[9])
                        setRight(userData[10])
                    }
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
            isReady(true);
        }
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

        .Category
        {
            border-bottom: 2px solid #dddddd;
        }

        .Container
        {
            display: grid;
            grid-template-columns: auto auto auto auto;
            gap: 5px;
        }

        .ContainerP
        {
            padding: 1px;
        }

        #vision
        {
            margin-top: 100px;
            padding-top: 25px;
        }

        #mood
        {
            margin-top: 100px;
            padding-top: 25px;
        }

        #med
        {
            margin-top: 1000px;
            padding-top: 25px;
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
            <h2>Assessment Date: ${date}</h2>
        </div>
    </header>

    <h1 class>Screening Questions</h1>
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

    <h1 class = "Category">Fall Risk Score: ${riskScore}</h1>

    <h1 class = "Category">Vitamin D Levels: ${vitaminD}</h1>

    <h1>Blood Pressure</h1>
    <table>
        <tr>
            <th>Test</th>
            <th>Blood Pressure</th>
        </tr>
        <tr>
            <th>Standing</th>
            <th>${standingBP}</th>
        </tr>
        <tr>
            <th>Lying</th>
            <th>${lyingBP}</thth>
        </tr>
    </table>

    <h1 id = "vision">Vision Test Scores</h1>
        <table>
            <tr>
                <th>Test</th>
                <th>Score</th>
            </tr>
            <tr>
                <th>Left Eye</th>
                <th>${(Math.round((leftMatch / 44) * 100))}% (${leftMatch} / 44)</th>
            </tr>
            <tr>
                <th>Right Eye</th>
                <th>${(Math.round((rightMatch / 44) * 100))}% (${rightMatch} / 44)</th>
            </tr>
        </table>
    
    

    <h1>TUG Test Results<h1>
    <table>
        <tr>
            <th>Test</th>
            <th>Duration</th>
        </tr>
        <tr>
            <th>Test 1</th>
            <th>${test[0]}</th>
        </tr>
        <tr>
            <th>Test 2</th>
            <th>${test[1]}</th>
        </tr>
        <tr>
            <th>Test 3</th>
            <th>${test[2]}</th>
        </tr>
    </table>

    <h1>Neuropathy Results</h1>
    <div style="display:flex; flex-direction:row; gap:20px;">
        <div>
            <h3>Left Foot</h3>
            <img id="feetResults" src="data:image/png;base64,${leftDiagram}"></img>
        </div>
        <div>
            <h3>Right Foot</h3>
            <img id="feetResults" src="data:image/png;base64,${rightDiagram}"></img>
        </div>
    </div>

    <h1 id = "mood">Mood Questions</h1>
        <div class = "Container">
            <p class = "ContainerP">1: Not at all</p>
            <p class = "ContainerP">2: Several days</p>
            <p class = "ContainerP">3: More than half days</p>
            <p class = "ContainerP">4: Nearly everyday</p>
        </div>
    <table>
        <tr>
            <th>Question</th>
            <th>Answer</th>
        </tr>
        <tr>
            <th>Little interest or pleasure in doing things.</th>
            <th>${depress}</th>
        </tr>
        <tr>
            <th>Feeling down, depressed, or hopeless.</th>
            <th>${pleasure}</th>
        </tr>
    </table>

    ${hazards}

    ${medications}

  </body>
</html>
    `;

    const downloadPDF = async () => 
    {
        const pid = await getPID();

        const { uri } = await Print.printToFileAsync({html});
        console.log('File has been saved to:', uri);


        const pdfName = `${uri.slice(0, uri.lastIndexOf('/') + 1)}${pid + date}.pdf`

        await FileSystem.moveAsync({
            from: uri,
            to: pdfName
        })

        if(await Sharing.isAvailableAsync())
        {
            await Sharing.shareAsync(pdfName);
        }
    }

    return (
        <View style = {styles.background}> 

        {!ready && (
            <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 32,
                    alignItems: 'center',
                    width: '75%',
                    marginBottom: 270
                }}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>
                        Generating PDF
                    </Text>
                    <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                        Please keep the app open while we create your PDF.
                    </Text>
                </View>
            </View>
        )}
            {ready && (
                <>
                    <TouchableOpacity
                        onPress={() =>
                            router.navigate({
                                pathname: '/educationalresources',
                                params: { returnRoute: '/pastassessments' },
                            })
                        }
                        style={styles.blueExtraButton}
                    >
                        <Text style={styles.btnText}>{t('layout.additionalInformation')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => downloadPDF()}
                        style={[styles.blueNextButton, { bottom: 60 }]}
                    >
                        <Text style={styles.btnText}>Download Results PDF</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
        
    )
}

export default PDFGen;