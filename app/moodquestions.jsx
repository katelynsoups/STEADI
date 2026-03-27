import MoodQuestions from '../src/components/MoodQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';

const MoodQuestionsPage = () => {
    
    updateSaveStatus('/moodquestions');

    return (
        <MoodQuestions />
    );
};

export default MoodQuestionsPage;