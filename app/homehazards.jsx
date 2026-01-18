import HomeHazards, {buttonStats} from '../src/components/HomeHazards';
import { getHazards } from '../src/data/hazardQuestions';

const HomeHazardsPage = () => {
    const hazards = getHazards(0);

    return (
        <HomeHazards questions = {hazards} next = '/homehazards2'/>
    );
};

export default HomeHazardsPage;