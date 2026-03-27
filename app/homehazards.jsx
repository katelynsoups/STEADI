import HomeHazards, {buttonStats} from '../src/components/HomeHazards';
import { getHazards } from '../src/data/hazardQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';

const HomeHazardsPage = () => {
    const hazards = getHazards(0);

    updateSaveStatus('/homehazards');

    return (
        <HomeHazards questions = {hazards} next = '/homehazards2'/>
    );
};

export default HomeHazardsPage;